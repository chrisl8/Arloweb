#!/bin/bash
export ROS_HOSTNAME=`uname -n`.local
export ROS_MASTER_URI=`uname -n`.local
export ROSLAUNCH_SSH_UNKNOWN=1
source ~/catkin_ws/devel/setup.bash
/opt/ros/indigo/bin/rosnode list|grep rosout>/dev/null
if [ $? -ne 0 ]
then
echo "ROS NOT Running!"
exit 1
else
rosservice call /metatron_listener "${1}" "s${2}"
fi
exit 0

