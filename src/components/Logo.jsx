const lightLogo = '/images/branding/app-logo.png'
const darkLogo = '/images/branding/white.png'

export default function Logo({ className = '', size, width, height, alt = 'Metamorph' }) {
  const dimensions = {
    ...(size ? { width: size, height: size } : {}),
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  }

  return <>
    <img className={`${className} logo-light`.trim()} src={lightLogo} alt={alt} style={dimensions} loading="eager" fetchPriority="high" />
    <img className={`${className} logo-dark`.trim()} src={darkLogo} alt="" aria-hidden="true" style={dimensions} loading="eager" fetchPriority="high" />
  </>
}
