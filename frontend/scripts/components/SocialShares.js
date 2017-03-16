// test on https://cards-dev.twitter.com/validator

import React, { PropTypes } from 'react'
import classnames from 'classnames'

import Button from './Button'
import Icon from './Icon'
import { HASHTAGS, FACEBOOK_APP_ID, PROD_URL } from '../utils/secret'

const SocialShares = ({
  appUrl,
  caption,
  className,
  description,
  imageUrl,
  shareUrl,
  title
}) => {
  const tagDescription = `${description} ${HASHTAGS} ${PROD_URL}`
  return (<div className={classnames(className,"social-shares center")}>
    <Button
        className='button social-shares__share col sm-col-6'
        href={`https://www.facebook.com/dialog/feed?app_id=${FACEBOOK_APP_ID}&display=popup&title=${title}&description=${encodeURI(tagDescription).replace(/#/g, '%23')}&caption=${encodeURI(caption)}&picture=${imageUrl}&link=${appUrl}&redirect_uri=https://facebook.com`}
        target='_blank'
        external
      >
        <Icon className="social-shares__share__icon" icon="facebook-share" />
    </Button>
    <Button
        className='button social-shares__share col sm-col-6'
        href={`https://twitter.com/intent/tweet/?url=${shareUrl}&text=${title}`}
        target='_blank'
        external
      >
        <Icon className="social-shares__share__icon" icon="twitter-share" />
    </Button>
  </div>)
}

SocialShares.defaultProps =  {
  appUrl: 'http://pariteaupouvoir.heroku.com',
  caption: 'Parité au Pouvoir',
  description: "Signez notre pétition pour plus de femmes à l'Assemblée Nationale !",
  imageUrl: `${PROD_URL}/static/images/camembert.png`,
  shareUrl: PROD_URL,
  title: ' '
}

export default SocialShares
