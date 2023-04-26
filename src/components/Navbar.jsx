import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import {ReactComponent as DiscountIcon} from '../assets/svg/localDiscountIcon.svg'
import {ReactComponent as ListingsIcon} from '../assets/svg/listingsIcon.svg'
import {ReactComponent as PersonOutlineIcon} from '../assets/svg/personOutlineIcon.svg'

function Navbar() {

    const navigate = useNavigate()
    const location = useLocation()

    const pathMatchRoute = (route) => {
        if(route === location.pathname) {
            return true
        }
    }
  return (
    <footer className='navbar'>
        <nav className="navbarNav">
            <ul className="navbarListItems">
                <li className="navbarListItem" onClick={() => navigate('/')}>
                    <ListingsIcon fill={pathMatchRoute('/') ? '#2c2c2c' : "#8f8f8f"} width='36px' height='36px' />
                    <p className={pathMatchRoute('/') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Listings</p>
                </li>
                <li className="navbarListItem" onClick={() => navigate('/discounts')}>
                    <DiscountIcon fill={pathMatchRoute('/discounts') ? '#2c2c2c' : "#8f8f8f"} width='36px' height='36px' />
                    <p className={pathMatchRoute('/discounts') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Discounts</p>
                </li>
                <li className="navbarListItem" onClick={() => navigate('/profile')}>
                    <PersonOutlineIcon fill={pathMatchRoute('/profile') ? '#2c2c2c' : "#8f8f8f"} width='36px' height='36px' />
                    <p className={pathMatchRoute('/profile') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Profile</p>
                </li>
            </ul>
        </nav>
    </footer>
  )
}

export default Navbar