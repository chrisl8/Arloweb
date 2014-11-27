#!/bin/bash
# This should be called by stubStarter.sh,
# which is called by a PHP file,
# and requires this line in /etc/sudoers:
# daemon ALL = (chrisl8) NOPASSWD: /home/chrisl8/arloweb/startROS.sh
# To end this:
# kill $(ps -ef|grep metatron_id.launch|grep -v grep|awk '{print $2}')
export ROS_MASTER_URI=http://$(/sbin/ifconfig | grep "inet addr"|grep -v 127.0.0.1|awk -F: '{print $2}'|awk '{print $1}'):11311 # Set to laptop IP
export ROS_HOSTNAME=$(/sbin/ifconfig | grep "inet addr"|grep -v 127.0.0.1|awk -F: '{print $2}'|awk '{print $1}') # Set to THIS machine's IP
export ROSLAUNCH_SSH_UNKNOWN=1
# TODO: this is a mess because we don't know which packages were installed by the user.
# Which should be taken care of by metatron dependencies!
# TODO: We also don't know where this might be?!
if [ -e ~/hector_navigation/devel/setup.bash ]
then
  source ~/hector_navigation/devel/setup.bash
else
  source ~/metatron/devel/setup.bash
fi
/opt/ros/indigo/bin/rosnode list|grep rosout
if [ $? -ne 0 ]
then
#/opt/ros/indigo/bin/roslaunch metatron_id metatron_id.launch &
~/metatron/scripts/start-metatron.sh &
fi
