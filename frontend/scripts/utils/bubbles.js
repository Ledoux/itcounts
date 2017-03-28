
const options = [
  {
    centerYCoordinateRatio: 1.9,
    collideRadius: 3,
    maxSmRadius: 150,
    maxMdRadius: 150,
    minSmFontSize: 6,
    maxSmFontSize: 28,
    minMdFontSize: 10,
    maxMdFontSize: 24,
    description: `Le groupe Républicain comporte beaucoup moins de femmes (14%)
    que le groupe Socialiste (35%).`,
    text: 'Groupe Politique',
    value: 'parti_politique'
  },
  {
    minSmFontSize: 10,
    maxSmFontSize: 20,
    maxMdFontSize: 20,
    description: `Il y a trois fois plus de députés femmes travaillant
    dans les “Affaires culturelles” que dans la “Finance”.`,
    text: 'Commission',
    value: 'commission_permanente'
  },
  {
    minSmFontSize: 10,
    maxSmFontSize: 20,
    maxSmRadius: 100,
    description: `La nouvelle Aquitaine atteint presque la parité pour
    ses députés alors que l'Ile de France en est loin (35%).`,
    text: 'Région',
    value: 'region'
  },
  {
    minSmFontSize: 10,
    maxSmFontSize: 20,
    maxMdRadius: 120,
    description: `Après 70 ans, la proportion de députés femmes passe en dessous
      de la barre des 15%.`,
    text: 'Classe d\'âge',
    value: 'age'
  },
  {
    minSmFontSize: 20,
    minMdFontSize: 25,
    description: `15% des députés cumulant 4 mandats sont des femmes contre moins
      de 40% pour 1 mandat.`,
    text: 'Mandats cumulés',
    value: 'mandat'
  }
]
options.forEach((option, index) => {option.index = index})

export default options
