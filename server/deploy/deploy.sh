#!/usr/bin/env bash

set -Eeuo pipefail

DEPLOY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="${DEPLOY_DIR}/compose.yaml"
ENV_FILE="${DEPLOY_DIR}/.env"
IMAGES_FILE="${DEPLOY_DIR}/images.env"
PREVIOUS_FILE="${DEPLOY_DIR}/images.env.previous"
LOCK_FILE="${DEPLOY_DIR}/deploy.lock"

COMPONENT="${1:-}"
FIRST_IMAGE="${2:-}"
SECOND_IMAGE="${3:-}"

UPDATED=false

compose() {
  docker compose \
    --env-file "${ENV_FILE}" \
    --env-file "${IMAGES_FILE}" \
    -f "${COMPOSE_FILE}" \
    "$@"
}

usage() {
  cat <<'EOF'
사용법:
  ./deploy.sh all <frontend-image@sha256:digest> <backend-image@sha256:digest>
  ./deploy.sh frontend <frontend-image@sha256:digest>
  ./deploy.sh backend <backend-image@sha256:digest>
EOF
}

validate_image() {
  local image="$1"

  if [[ ! "${image}" =~ ^ghcr\.io/[a-z0-9._-]+/[a-z0-9._-]+@sha256:[0-9a-f]{64}$ ]]; then
    echo "잘못된 GHCR 이미지 주소입니다: ${image}"
    exit 1
  fi
}

current_image() {
  local variable_name="$1"

  if [[ -f "${IMAGES_FILE}" ]]; then
    sed -n "s/^${variable_name}=//p" "${IMAGES_FILE}" | tail -n 1
  fi
}

rollback() {
  local exit_code=$?

  trap - ERR

  echo "배포에 실패했습니다."

  if [[ "${UPDATED}" == "true" && -f "${PREVIOUS_FILE}" ]]; then
    echo "이전 이미지 설정으로 롤백합니다."

    cp "${PREVIOUS_FILE}" "${IMAGES_FILE}"

    compose pull
    compose up -d --remove-orphans --wait

    echo "롤백이 완료되었습니다."
  else
    echo "복원할 이전 images.env가 없습니다."
  fi

  exit "${exit_code}"
}

trap rollback ERR

if [[ ! -f "${COMPOSE_FILE}" ]]; then
  echo "compose.yml을 찾을 수 없습니다: ${COMPOSE_FILE}"
  exit 1
fi

if [[ ! -f "${ENV_FILE}" ]]; then
  echo ".env를 찾을 수 없습니다: ${ENV_FILE}"
  exit 1
fi

case "${COMPONENT}" in
  all)
    FRONTEND_IMAGE="${FIRST_IMAGE}"
    BACKEND_IMAGE="${SECOND_IMAGE}"

    [[ -n "${FRONTEND_IMAGE}" && -n "${BACKEND_IMAGE}" ]] || {
      usage
      exit 1
    }
    ;;

  frontend)
    FRONTEND_IMAGE="${FIRST_IMAGE}"
    BACKEND_IMAGE="$(current_image BACKEND_IMAGE)"

    [[ -n "${FRONTEND_IMAGE}" && -n "${BACKEND_IMAGE}" ]] || {
      echo "최초 배포는 all 방식으로 실행해야 합니다."
      exit 1
    }
    ;;

  backend)
    BACKEND_IMAGE="${FIRST_IMAGE}"
    FRONTEND_IMAGE="$(current_image FRONTEND_IMAGE)"

    [[ -n "${FRONTEND_IMAGE}" && -n "${BACKEND_IMAGE}" ]] || {
      echo "최초 배포는 all 방식으로 실행해야 합니다."
      exit 1
    }
    ;;

  *)
    usage
    exit 1
    ;;
esac

validate_image "${FRONTEND_IMAGE}"
validate_image "${BACKEND_IMAGE}"

exec 9>"${LOCK_FILE}"

if ! flock -n 9; then
  echo "다른 배포가 이미 진행 중입니다."
  exit 1
fi

if [[ -f "${IMAGES_FILE}" ]]; then
  cp "${IMAGES_FILE}" "${PREVIOUS_FILE}"
fi

TEMP_FILE="$(mktemp "${DEPLOY_DIR}/images.env.tmp.XXXXXX")"

printf 'FRONTEND_IMAGE=%s\n' "${FRONTEND_IMAGE}" > "${TEMP_FILE}"
printf 'BACKEND_IMAGE=%s\n' "${BACKEND_IMAGE}" >> "${TEMP_FILE}"

chmod 600 "${TEMP_FILE}"
mv "${TEMP_FILE}" "${IMAGES_FILE}"

UPDATED=true

case "${COMPONENT}" in
  all)
    compose pull
    compose up -d --remove-orphans --wait
    ;;

  frontend)
    compose pull frontend
    compose up -d --no-deps --wait frontend
    ;;

  backend)
    compose pull backend
    compose up -d --no-deps --wait backend
    ;;
esac

UPDATED=false
trap - ERR

compose ps

echo "배포가 완료되었습니다."