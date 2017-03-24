if [[ ! $(heroku apps:info -a pariteaupouvoir) ]]; then
  git init
  heroku create --app pariteaupouvoir --buildpack heroku/nodejs --remote production
  heroku config:set --app pariteaupouvoir TYPE=production
else
  echo "pariteaupouvoir has been already created"
fi
