BBB_PASS = temppwd
BBB_IP = 192.168.7.2
BBB_USER = debian

bbb-ssh:
	sshpass -p ${BBB_PASS} ssh ${BBB_IP} -l ${BBB_USER}

bbb-install:
	- sshpass -p ${BBB_PASS} ssh ${BBB_IP} -t -l ${BBB_USER} "sudo apt-get update"
	- sshpass -p ${BBB_PASS} ssh ${BBB_IP} -t -l ${BBB_USER} "sudo apt-get upgrde"
	- sshpass -p ${BBB_PASS} ssh ${BBB_IP} -l ${BBB_USER} "mkdir ~/skysense"
	- sshpass -p ${BBB_PASS} scp ./skysense-api/skybroker_1.0.0_armhf.deb ${BBB_USER}@${BBB_IP}:~/skysense/
	- sshpass -p ${BBB_PASS} ssh ${BBB_IP} -t -l ${BBB_USER} "sudo dpkg -i ~/skysense/skybroker_1.0.0_armhf.deb"
	- sshpass -p ${BBB_PASS} ssh ${BBB_IP} -t -l ${BBB_USER} "sudo apt-get install -f"


sd-flash:
	xzcat ./skysense-api/skysense-0.0.3-bone-debian-9.1-iot-armhf-linux-4.9.61-2017-08-31-4gb.img.xz | sudo dd of=/dev/sdX
