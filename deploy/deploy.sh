#!/bin/bash
#microservices..
  #apis4atp..
  #git clone --quiet https://github.com/solutionsanz/apis4atp >>/tmp/noise.out && cd apis4atp
  kubectl create namespace apis4atp >>/tmp/noise.out
  kubectl create -f kubernetes/apis4atp-dpl.yaml >>/tmp/noise.out
  kubectl create -f kubernetes/apis4atp-svc.yaml >>/tmp/noise.out
  kubectl create -f kubernetes/apis4atp-ing.yaml >>/tmp/noise.out
