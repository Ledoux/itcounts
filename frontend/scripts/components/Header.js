import classnames from 'classnames'
import React from 'react'
import { connect } from 'react-redux'

import Link from './Link'
import Logo from './Logo'
import { showModal } from '../reducers/modal'
import { links } from '../utils/constants'

const Header = ({
  darkHeaderBackground
}) => (<header className='header'>
  <div className='header__top-nav flex items-center relative'>
    <div className='header__top-nav__logo'>
      <Link
        className='header__top-nav__logo__link col'
        external='true'
        href='http://cri-paris.org/en/discover-itcounts-start-promoting-gender-balance/'
      >
        <Logo />
      </Link>
      <div className='header__top-nav__logo__text col'>
        PARIT&Eacute; <br /> AU POUVOIR
      </div>
    </div>
    <div className='flex-auto' />
    <div className='xs-hide'>
      {links.map(({external, extraClass, label, path}, index) => {
        return (<Link
          className={classnames('header__top-nav__link p2 mr3',
            extraClass)}
          key={index}
          {...{href: path, external}} >
            {label}
        </Link>) })}
    </div>
  </div>
</header>)

Header.defaultProps = {
}

export default connect(null, { showModal })(Header)
