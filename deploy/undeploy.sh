#!/bin/bash
#microservices..
  #apis4atp..
  kubectl delete -f deploy/kubernetes/apis4atp-ing.yaml >>/tmp/noise.out
  kubectl delete -f deploy/kubernetes/apis4atp-svc.yaml >>/tmp/noise.out
  kubectl delete -f deploy/kubernetes/apis4atp-dpl.yaml >>/tmp/noise.out
  kubectl delete namespace apis4atp >>/tmp/noise.out