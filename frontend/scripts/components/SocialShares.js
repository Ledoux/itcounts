import React, { PropTypes } from 'react'
import classnames from 'classnames'

import Button from './Button'
import Icon from './Icon'
import { FACEBOOK_APP_ID } from '../utils/secret'

const SocialShares = ({
  appUrl,
  caption,
  className,
  description,
  imageUrl,
  shareUrl,
  title
}) => {
  return (<div className={classnames(className,"social-shares center")}>
    <Button
        className='button social-shares__share col sm-col-6'
        href={`https://www.facebook.com/dialog/feed?app_id=${FACEBOOK_APP_ID}&display=popup&title=${title}&description=${description}&caption=${caption}&picture=${imageUrl}&link=${appUrl}&redirect_uri=https://facebook.com`}
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
  appUrl: 'http://parite-au-pouvoir.heroku.com',
  caption: 'Parité au Pouvoir',
  description: `Signez notre pétition pour plus de femmes à l'Assemblée Nationale !
  http://parite-au-pouvoir.heroku.com %23VEGA %23Parité %23Politique
  `,
  imageUrl: 'http://parite-au-pouvoir.heroku.com/static/images/camembert.png',
  shareUrl: 'http://parite-au-pouvoir.heroku.com',
  title: "Quelle est la répartition du genre dans l\'Assemblée Nationale ?",
}

export default SocialShares
