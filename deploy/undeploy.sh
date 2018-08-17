#!/bin/bash
#microservices..
  #acorn..
  kubectl delete -f deploy/kubernetes/acorn-ing.yaml >>/tmp/noise.out
  kubectl delete -f deploy/kubernetes/acorn-svc.yaml >>/tmp/noise.out
  kubectl delete -f deploy/kubernetes/acorn-dpl.yaml >>/tmp/noise.out
  kubectl delete namespace acorn >>/tmp/noise.out