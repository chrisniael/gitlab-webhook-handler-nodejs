#! /bin/bash

JEKYLL_BIN="/usr/local/rvm/gems/ruby-2.4.1/bin/jekyll"
GIT_BIN="/usr/bin/git"
GIT_URL="git@git.shenyu.me:shenyu/shenyu.me.git"
GIT_CLONE_DEST="/usr/share/nginx/html/github-webhook-handler/repository/shenyu.me"
GIT_CLONE_DEST="/usr/share/nginx/html/shenyu.me"
USER=$(whoami);

function deploy_site
{
    cd $GIT_CLONE_DEST
    $GIT_BIN reset --hard origin/master
    $GIT_BIN clean -f
    $GIT_BIN fetch origin
    $GIT_BIN pull origin master
    $GIT_BIN checkout master

    JEKYLL_ENV=production $JEKYLL_BIN build -s $GIT_CLONE_DEST -d $GIT_CLONE_DEST/_site 
}

if [ "$USER" == "root" ]
then
    deploy_site
    echo "Deploy success."
else
    echo "You don't have right to execute it."
fi
