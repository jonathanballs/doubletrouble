from fabric.api import *
from fabric.contrib.files import *
from fabric.contrib.project import rsync_project
from subprocess import check_output

env.user = 'ubuntu'
env.hosts = ['52.212.82.92']
env.key_filename = 'cert.pem'

def deploy():
    # Tar it up and send to server
    local('tar\
        -cf\
        /tmp/trouble.tar.gz\
        --exclude=node_modules\
        *'
    )
    put('/tmp/trouble.tar.gz', '/tmp/trouble.tar.gz')
    deploy_path = '/home/trouble/doubletrouble'

    # Delete old deploy
    run('sudo rm -rf {}'.format(deploy_path))
    run('sudo mkdir -p {}'.format(deploy_path))

    # Extract new deploy
    run('sudo tar xf /tmp/trouble.tar.gz -C {}'.format(deploy_path))
    run('sudo chown -R trouble:trouble /home/trouble'.format(deploy_path))
    run('sudo chmod -R 777 /home/trouble'.format(deploy_path))
    run("sudo su trouble -c 'cd {} && npm install .'".format(deploy_path))

    run('sudo cp {}/trouble.conf /etc/init/trouble.conf'.format(deploy_path))
    run('sudo service trouble restart')
    run('sudo rm /tmp/trouble.tar.gz')
    local('rm /tmp/trouble.tar.gz')

def provision():
    run('sudo apt-get install -y htop tmux nodejs-legacy npm')
    run('sudo id -u trouble &>/dev/null || (sudo useradd trouble && sudo mkdir /home/trouble/ && sudo chown trouble:trouble /home/trouble)')
    run('sudo npm install -g pm2')
    run('curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -')
    run('sudo apt-get install -y nodejs')

def restart():
    run('sudo service doubletrouble restart');

