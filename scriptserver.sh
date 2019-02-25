#!/bin/bash
pm2 stop nginxserver.js
pm2 start nginxserver.js
pm2 logs nginxserver  