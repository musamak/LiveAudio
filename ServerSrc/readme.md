

Autostart Settings for Raspbian:
$ sudo nano /home/pi/.config/lxsession/LXDE-pi/autostart

#Add the following lines in above file

@/usr/local/bin/noip2
@/home/pi/Downloads/LiveAudio-server npm start
@/usr/bin/chromium-browser --kiosk --disable-restore-session-state http://localhost:2512


