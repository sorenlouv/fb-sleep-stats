#!/bin/bash

pwd=`pwd`
dev_file="$pwd/config/development.json"

# Dependencies : cat, grep, echo, pwd, npm

show_help() {
	echo "Usage: ./run.sh | ./run.sh --daemon"
	echo "Flags 		Description"
	echo
	echo "-d, --daemon 	No output, runs in background"
	echo "-r, --reinstall 	Reinstalls and Rebuilds packages"
	echo "-h, --help 	prints this help dialog"
	echo
	echo "[!] Facebook - Dev settings [App ID]: https://developers.facebook.com/apps"
	echo "[!] Github - Readme.md : https://github.com/sqren/fb-sleep-stats"
	echo '[!] Update "XS" - https://gist.github.com/sqren/0e4563f258c9e85e4ae1'
	echo '[!] Update "c_user | facebook ID" - https://stalkscan.com/'
	c_user=`cat $dev_file | json_pp | grep c_user | grep -Eo "[0-9]{1,}"`
	echo "c_user AKA facebook ID - $c_user"
	xs=`cat $dev_file | json_pp | grep xs | grep -Eo "[0-9a-z%A-Z]{1,}" | tail -n 1`
	echo "xs aka facebook auth cookie - $xs"
	AppID=`cat $dev_file | json_pp | grep appId | grep -Eo "[0-9]{1,}"`
	echo "AppID - $AppID"
}

check_deps() {
	exit_code=`command -v npm &> /dev/null ; echo $?`
	if [ $exit_code -eq 1 ] ; then
		echo "[!] Error! npm is not installed! Exiting!"
		exit 1
	fi
}

reinstall() {
	git pull
	rm -rf node_modules package-lock.json
	echo "[+] Deleted node_modules & package-lock.json"
	npm install
	echo "[+] Installed Dependencies"
	npm run webpack
	echo "[+] Built required packages"
}

main() {
	port=`cat $dev_file | json_pp | grep port | grep -Eo "[0-9]{1,}"`
	pollingInterval=`cat $dev_file | json_pp | grep pollingInterval | grep -Eo "[0-9]{1,}"`
	npm start > /dev/null 2>&1 &
	echo "[+] Web Server started @ http://localhost:$port"
	echo "[+] Scraper running, output every $pollingInterval seconds"
	npm run scrape 2>/dev/null

}

daemon_mode() {
	main &> /dev/null & #Silences all output, runs as a background job
	echo "[!] Running in Daemon Mode"
}

daemon_flag=0
reinstall_flag=0
for i in "$@"
do
	case $i in
		-h|--help)
			show_help
			exit 0
			;;
		-d|--daemon)
			daemon_flag=1
			;;
		-r|--reinstall)
			reinstall_flag=1
			;;
	esac
done

check_deps

if [ $daemon_flag -eq 1 ]; then
	daemon_mode
fi

if [ $reinstall_flag -eq 1 ]; then
	reinstall
fi


if [ $daemon_flag -eq 0 ]; then
	read -r -p "Start the Script? [Y/n] " response
	response=${response,,}  # ,, makes lowercase
	if [[ $response =~ ^(yes|y) ]]; then
		main
	fi
fi

