import React from 'react'

import Link from './Link'
import Logo from './Logo'
import { links } from '../utils/config'

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
    </div>
    <div className='flex-auto' />
    <div className='header__top-nav__links'>
      {links.map(({label, sectionId}, index) => {
        return (<Link
          className='link header__top-nav__links__link'
          key={index}
          href={`/#${sectionId}`}
          onClick={() => {
            document.querySelector(`section#${sectionId}`)
                    .scrollIntoView({behavior: 'smooth'})
          }}
          {...{useAnchor: true}}
        >
            {label}
        </Link>
      )}).concat([
          <Link
            className='link header__top-nav__links__link'
            download='parite_au_pouvoir.pdf'
            href='/static/en-savoir-plus.pdf'
            key={links.length}
          >
            EN SAVOIR PLUS
          </Link>
        ])
      }
    </div>
  </div>
</header>)

export default Header
