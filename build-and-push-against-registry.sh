#!/bin/sh

podman build --format docker --manifest docker.anmirliegts.net/rathsolutions/schuglemapstwofrontend --platform linux/amd64 --platform linux/arm64 .
podman manifest push docker.anmirliegts.net/rathsolutions/schuglemapstwofrontend docker://docker.anmirliegts.net/rathsolutions/schuglemapstwofrontend
