#!/bin/bash
#microservices..
  #apis4atp..
  kubectl delete -f kubernetes/apis4atp-ing.yaml >>/tmp/noise.out
  kubectl delete -f kubernetes/apis4atp-svc.yaml >>/tmp/noise.out
  kubectl delete -f kubernetes/apis4atp-dpl.yaml >>/tmp/noise.out
  kubectl delete namespace apis4atp >>/tmp/noise.out