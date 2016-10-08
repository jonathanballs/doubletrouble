from fabric.api import *
from fabric.contrib.files import *
from fabric.contrib.project import rsync_project
from subprocess import check_output

env.user = 'ubuntu'
env.hosts = ['ec2-52-88-152-45.us-west-2.compute.amazonaws.com']
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
    run("sudo npm install {}".format(deploy_path))

    run('sudo cp {}/trouble.service /lib/systemd/system/trouble.service'.format(deploy_path))
    run('sudo service trouble restart')
    run('sudo rm /tmp/trouble.tar.gz')
    local('rm /tmp/trouble.tar.gz')

def provision():
    run('sudo apt-get install -y htop tmux nodejs-legacy npm')
    run('sudo id -u trouble &>/dev/null || (sudo useradd trouble && sudo mkdir /home/trouble/ && sudo chown trouble:trouble /home/trouble)')

def restart():
    run('service doubletrouble restart');

