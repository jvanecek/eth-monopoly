#!/usr/bin/env bash

# Exit script as soon as a command fails.
set -o errexit

# Executes cleanup function at script exit.
trap cleanup EXIT

cleanup() {
  # Kill the testrpc instance that we started (if we started one and if it's still running).
  if [ -n "$testrpc_pid" ] && ps -p $testrpc_pid > /dev/null; then
    kill -9 $testrpc_pid
  fi
}

testrpc_port=8545

start_testrpc() {
  # We define 10 accounts with balance 1M ether, needed for high-value tests.
  local accounts=(
    --account="0x001865fd4b4cfbeb4ec8ac33e00c3569368d2ecaaa7fd5479d9b96854e46e1d0,1000000000000000000000000"
    --account="0x001865fd4b4cfbeb4ec8ac33e00c3569368d2ecaaa7fd5479d9b96854e46e1d1,1000000000000000000000000"
    --account="0x001865fd4b4cfbeb4ec8ac33e00c3569368d2ecaaa7fd5479d9b96854e46e1d2,1000000000000000000000000"
    --account="0x001865fd4b4cfbeb4ec8ac33e00c3569368d2ecaaa7fd5479d9b96854e46e1d3,1000000000000000000000000"
    --account="0x001865fd4b4cfbeb4ec8ac33e00c3569368d2ecaaa7fd5479d9b96854e46e1d4,1000000000000000000000000"
    --account="0x001865fd4b4cfbeb4ec8ac33e00c3569368d2ecaaa7fd5479d9b96854e46e1d5,1000000000000000000000000"
    --account="0x001865fd4b4cfbeb4ec8ac33e00c3569368d2ecaaa7fd5479d9b96854e46e1d6,1000000000000000000000000"
    --account="0x001865fd4b4cfbeb4ec8ac33e00c3569368d2ecaaa7fd5479d9b96854e46e1d7,1000000000000000000000000"
    --account="0x001865fd4b4cfbeb4ec8ac33e00c3569368d2ecaaa7fd5479d9b96854e46e1d8,1000000000000000000000000"
    --account="0x001865fd4b4cfbeb4ec8ac33e00c3569368d2ecaaa7fd5479d9b96854e46e1d9,1000000000000000000000000"
  )


  testrpc "${accounts[@]}" 

  testrpc_pid=$!
}

echo "Starting our own testrpc instance"
start_testrpc
