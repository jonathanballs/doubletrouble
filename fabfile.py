from fabric.api import *
from fabric.contrib.files import *
from fabric.contrib.project import rsync_project
from subprocess import check_output

env.user = 'root'
# We will have a domain soon
env.hosts = ['138.68.159.8']
#env.key_filename = 'cert.pem'

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
    run('rm -rf {}'.format(deploy_path))
    run('mkdir {}'.format(deploy_path))

    # Extract new deploy
    run('tar xf /tmp/trouble.tar.gz -C {}'.format(deploy_path))
    run('sudo chown -R trouble:trouble {}'.format(deploy_path))
    run('sudo chmod -R 777 {}'.format(deploy_path))
    run("runuser -l trouble -c 'npm install {}'".format(deploy_path))

    run('sudo cp {}/trouble.service /lib/systemd/system/trouble.service'.format(deploy_path))
    run('sudo service trouble restart')
    run('rm /tmp/trouble.tar.gz')
    local('rm /tmp/trouble.tar.gz')

def provision():
    run('apt-get install -y htop tmux nodejs-legacy npm')
    run('id -u somename &>/dev/null || (useradd trouble && mkdir /home/trouble/ && chown trouble:trouble /home/trouble)')

def restart():
    run('service doubletrouble restart');

