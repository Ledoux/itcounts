if [[ ! $(heroku apps:info -a staging-pariteaupouvoir) ]]; then
  git init
  heroku create --app staging-pariteaupouvoir --buildpack heroku/nodejs --remote staging
  heroku config:set --app staging-pariteaupouvoir TYPE=staging
else
  echo "staging-pariteaupouvoir has been already created"
  echo "Do you wish to delete this app (y/n)?"
  read answer
  if echo "$answer" | grep -iq "^y" ;then
    heroku apps:destroy staging-pariteaupouvoir --confirm staging-pariteaupouvoir;
    heroku create --app staging-pariteaupouvoir --buildpack heroku/nodejs --remote staging;
    heroku config:set --app staging-pariteaupouvoir TYPE=staging;
    # heroku domains:add www.staging-pariteaupouvoir.org
  else
    echo No
  fi
fi
