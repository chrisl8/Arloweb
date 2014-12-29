#!/bin/bash
# This should be called by stubRunner.sh
# which is called by a PHP file,
# and requires this line in /etc/sudoers:
# daemon ALL = (chrisl8) NOPASSWD: /home/chrisl8/arloweb/runROSthings.sh
export ROS_MASTER_URI=http://$(/sbin/ifconfig | grep "inet addr"|grep -v 127.0.0.1|awk -F: '{print $2}'|awk '{print $1}'):11311 # Set to laptop IP
export ROS_HOSTNAME=$(/sbin/ifconfig | grep "inet addr"|grep -v 127.0.0.1|awk -F: '{print $2}'|awk '{print $1}') # Set to THIS machine's IP
export ROSLAUNCH_SSH_UNKNOWN=1
source ~/metatron/devel/setup.bash
/opt/ros/indigo/bin/rosnode list|grep rosout>/dev/null
if [ $? -ne 0 ]
then
echo "ROS NOT Running!"
else
rosservice call /metatron_listener "${1}" "s${2}"
fi
