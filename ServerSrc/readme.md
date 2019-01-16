Install Firewall (ufw)
sudo apt-get install ufw
sudo ufw allow 2512
sudo ufw allow 9002

Autostart Settings for Raspbian:
$ sudo nano /home/pi/.config/lxsession/LXDE-pi/autostart

#Add the following lines in above file

@/usr/local/bin/noip2
@lxterminal -e "npm start ~/Downloads/LiveAudio-server"
@/usr/bin/chromium-browser --kiosk --disable-restore-session-state http://localhost:2512


