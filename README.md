The Team with No Name


## setup routs
## Add views 
## create database
## schema
## login 
## register



## Instructions for Installing MongoDB

Run the following commands

sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
sudo apt-get update
sudo apt-get install -y mongodb-org
cd
mkdir data
echo "mongod --dbpath=data --nojournal" > mongod
chmod a+x mongod

./mongod