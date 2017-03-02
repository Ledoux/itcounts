import React from 'react'
import { connect } from 'react-redux'

import Link from './Link'
import Logo from './Logo'
import { showModal } from '../reducers/modal'
import { links } from '../utils/constants'

if (typeof document !== 'undefined') {
  // needs this polyfill to make scrollIntoView smooth working in Chrome
  require('smoothscroll-polyfill').polyfill()
}

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
      {links.map(({label, sectionId}, index) => {
        return (<Link
          className='link header__top-nav__link p2 mr3'
          key={index}
          href={`/#${sectionId}`}
          onClick={() => {
            document.querySelector(`section#${sectionId}`)
              .scrollIntoView({behavior: 'smooth'})
          }}
          {...{forceAnchorElement: true}}
        >
            {label}
        </Link>) })}
    </div>
  </div>
</header>)

export default connect(null, { showModal })(Header)
