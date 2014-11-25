#!/bin/bash
# This is meant to be called by stubStopper.sh
kill $(ps -ef|grep metatron_id.launch|grep -v grep|awk '{print $2}')

