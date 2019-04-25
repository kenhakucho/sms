#!/bin/sh

LOG=/home/admin/sms.log
PID=/var/run/nodemond/nodomond.pid

touch $LOG
/usr/bin/nodemon /home/haku/sms/src/bin/www >> $LOG 2>&1
echo $! > $PID

while true
do
   sleep 10
   CNT=`ps aux | grep nodemond | grep -v grep | wc -l`
   if [ $CNT=0 ]; then
      echo "exited : "`date` >> $LOG
      break
   fi
done


