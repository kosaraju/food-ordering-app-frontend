import { faStopCircle } from '@fortawesome/fontawesome-free-regular';
import { faCircle, faMinus, faPlus, faRupeeSign, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fade, withStyles } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import React, { Component } from 'react';
import 'typeface-roboto';
import Header from '../../common/Header';
import './Details.css';

/**
 * Custom Styles used to customize material ui components
 * @param {*} theme
 */
const styles = theme => ({
    /* style the details of restaurant with top and bottom margin */
    detail: {
        margin: '2% 0%'
    },
    /* set font to bold */
    bold: {
        'font-weight': 600
    },
    /* Set the margin for category name */
    category: {
        marginBottom: '1%'
    },
    /* Set the margin for menu item */
    menuItem: {
        marginLeft: '4%'
    },
    /* Set the margin for the add icon (plus symbol) */
    addIcon: {
        marginLeft: '4%'
    },
    /* Set the margin and width of items added to cart */
    cartMenuItem: {
        marginLeft: '5%',
        width: '40%'
    },
    /* Style the minus button on cart section */
    minusBtn: {
        margin: '0px 8px',
        padding: '5px',
        color: 'black',
        fontSize: 'medium',
        '&:hover': {
            'background-color': 'rgb(248, 244, 8)'
        }
    },
    /* Style the plus button on cart section */
    plusBtn: {
        margin: '0px 8px',
        padding: '5px',
        color: 'black',
        fontSize: 'medium',
        '&:hover': {
            'background-color': 'rgb(248, 244, 8)'
        }
    },
    /* Set the scale of the badge on cart to show large badge */
    badge: {
        transform: 'scale(1.2) translate(50%, -50%)'
    }
});

class Details extends Component {
    constructor() {
        super();
        /**
         * Set the state with all the required fields and values
         */
        this.state = {
            restaurantDetails: {},
            showSnackbar: false,
            snackBarMsg: '',
            transition: Fade,
            cartItems: [],
            noOfItemsInCart: 0,
            cartTotalAmount: 0,
            isBadgeVisible: true
        };
    }

    /**
     * This will be called before mounting the component, pulls the restaurant details
     * to show on the page along with the categories and items under it
     */
    UNSAFE_componentWillMount() {
        let restaurantID = this.props.match.params.restaurantID;
        let xhr = new XMLHttpRequest();
        let thisComponent = this;
        xhr.addEventListener('readystatechange', function () {
            if (this.readyState === 4 && this.status === 200) {
                let response = JSON.parse(this.response);
                let categories = response.categories;
                let categoriesText = '';
                // parse the categories separated by ',' to show as single text
                for (let index = 0; index < categories.length; index++) {
                    categoriesText = categoriesText.concat(categories[index].category_name);
                    if (index < categories.length - 1) {
                        categoriesText = categoriesText.concat(',').concat(' ');
                    }
                }
                // set the restaurant details from the api response
                let restaurantDetails = {
                    uuid: response.id,
                    restaurantName: response.restaurant_name,
                    photoURL: response.photo_URL,
                    customerRating: response.customer_rating,
                    averagePrice: response.average_price,
                    noOfCustomersRated: response.number_customers_rated,
                    locality: response.address.locality,
                    categories: response.categories,
                    categoriesText: categoriesText
                }
                // Set the details to state variable
                thisComponent.setState({
                    restaurantDetails: restaurantDetails
                });
            }
        })
        let data = null;
        // Access the get restaurant api of backend to get the details based on restaurantID
        xhr.open('GET', this.props.baseUrl + '/restaurant/' + restaurantID);
        xhr.send(data);
    }

    /**
     * This will be called when the add button is clicked beside the item in menu
     * adds the item to cart, updates the quantity if the item is already in cart
     */
    addItemClickHandler = (item) => {

        let cartItems = this.state.cartItems;
        let noOfItemsInCart = this.state.noOfItemsInCart;
        let isItemAlreadyInCart = false;

        /**
         * Search for existing cart items, if found, update the quantity and price
         */
        cartItems.forEach(cartItem => {
            if (cartItem.id === item.id) {
                cartItem.quantity++;
                cartItem.totalItemPrice = cartItem.price * cartItem.quantity;
                isItemAlreadyInCart = true;
            }
        });
        // If item is added for the first time
        if (!isItemAlreadyInCart) {
            let cartItem = {
                id: item.id,
                item_name: item.item_name,
                price: item.price,
                item_type: item.item_type,
                quantity: 1,
                totalItemPrice: item.price
            }
            cartItems.push(cartItem);
        }
        noOfItemsInCart++;
        // Setting the state variable to show the Snackbar
        this.setState({
            showSnackbar: true,
            snackBarMsg: 'Item added to cart!',
            cartItems: cartItems,
            noOfItemsInCart: noOfItemsInCart,
            cartTotalAmount: this.state.cartTotalAmount + item.price
        });
    }

    /**
     * Toggle the badge visibility so as not to overlap with the model, when user is not logged in
     * hide the badge on cart when the modal is opened and viceversa 
     */
    toggleBadgeVisibility = () => {
        this.setState({
            isBadgeVisible: !this.state.isBadgeVisible
        });
    }

    /**
     * This method removes the item selected from the cart, decrements the quantity and 
     * if quantity reaches zero, completely remove the item from cart and update the cart item
     * price and total cart amount
     */
    removeItemFromCartHandler = (cartItem) => {
        let snackBarMsg = '';
        cartItem.quantity--;
        // Quantity zero indicates, this items should be removed from cart completely
        if (cartItem.quantity <= 0) {
            let cartItems = this.state.cartItems;
            // remove the item from the cart
            cartItems.splice(cartItems.indexOf(cartItem), 1);
            snackBarMsg = 'Item removed from cart!';
        } else {
            // update the total item price for the updated quantity
            cartItem.totalItemPrice = cartItem.quantity * cartItem.price;
            snackBarMsg = 'Item quantity decreased by 1!';
        }
        // Update the cart total amount, no of items count in cart
        this.setState({
            showSnackbar: true,
            snackBarMsg: snackBarMsg,
            noOfItemsInCart: this.state.noOfItemsInCart - 1,
            cartTotalAmount: this.state.cartTotalAmount - cartItem.price
        });
    }

    /**
     * Increase the quantity of the items in cart, update the each cart item total price and
     * total cart amount
     */
    addItemToCartHandler = (cartItem) => {
        cartItem.quantity++;
        cartItem.totalItemPrice = cartItem.quantity * cartItem.price;
        this.setState({
            showSnackbar: true,
            snackBarMsg: 'Item quantity increased by 1!',
            noOfItemsInCart: this.state.noOfItemsInCart + 1,
            cartTotalAmount: this.state.cartTotalAmount + cartItem.price
        });
    }

    /**
     * Checkout with the items added to cart for placing an order
     * validate if user is logged in or not, if not logged in show snackbar to login first
     * if already logged in, then pass on the cart details to checkout screen
     */
    checkoutClickHandler = () => {

        let isUserLoggedIn = sessionStorage.getItem('access-token') != null;
        // Check if any items are added to cart or not
        if (this.state.cartItems !== null && this.state.cartItems.length > 0) {
            // Check if the customer is logged in or not
            if (!isUserLoggedIn) {
                this.setState({
                    showSnackbar: true,
                    snackBarMsg: 'Please login first!'
                });
            } else {
                // If items are in cart and customer is logged in, proceed to checkout
                this.props.history.push({
                    pathname: '/checkout',
                    state: {
                        cartItems: this.state.cartItems,
                        restaurantID: this.state.restaurantDetails.uuid,
                        restaurantName: this.state.restaurantDetails.restaurantName
                    }
                });
            }
        }
        else {
            // Show snackbar message to add items to cart
            this.setState({
                showSnackbar: true,
                snackBarMsg: 'Please add an item to your cart!'
            });
        }
    }

    /**
     * Handle Close event on Snackbar, if close event is triggered, hide it
     */
    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        // Setting the state variable to hide the Snackbar
        this.setState({ showSnackbar: false, snackBarMsg: '' });
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Header pageId='details' baseUrl={this.props.baseUrl} toggleBadgeVisibility={this.toggleBadgeVisibility} />
                {/**
                 * Show the complete page with details only if server responds with data of restaurant
                 * i.e. if uuid is not valid, then no data received from server and nothing will be displayed
                 */}
                {this.state.restaurantDetails.uuid &&
                    <div>
                        <div className='restaurant-info-container'>
                            <div className='image-section'>
                                {/**
                                 * Show the restaurant image
                                 */}
                                <img className='restaurant-img' src={this.state.restaurantDetails.photoURL} alt={this.state.restaurantDetails.restaurantName} />
                            </div>
                            {/**
                             * Show the details of the restaurant
                             */}
                            <div className='details-section'>
                                <Typography variant='h4' component='h4' className={classes.detail}>
                                    {this.state.restaurantDetails.restaurantName}
                                </Typography>
                                <Typography variant='subtitle2' component='p' className={classes.detail}>
                                    {this.state.restaurantDetails.locality}
                                </Typography>
                                <Typography variant='subtitle2' component='p' className={classes.detail}>
                                    {this.state.restaurantDetails.categoriesText}
                                </Typography>
                                {/**
                                 * Show the ratings, no of customers rated along with the average price for two
                                 */}
                                <div className='rating-price-container'>
                                    <div className='rating-section'>
                                        <Typography variant='subtitle1' component='p' className={classes.bold}>
                                            <FontAwesomeIcon icon={faStar} className='fa-star-icon' /> {this.state.restaurantDetails.customerRating}
                                        </Typography>
                                        <Typography variant='caption' component='p' className='caption-text'>
                                            AVERAGE RATING BY <span className='no-of-customers'>{this.state.restaurantDetails.noOfCustomersRated}</span> CUSTOMERS
                                    </Typography>
                                    </div>
                                    <div className='price-section'>
                                        <Typography variant='subtitle1' component='p' className={classes.bold}>
                                            <FontAwesomeIcon icon={faRupeeSign} /> {this.state.restaurantDetails.averagePrice}
                                        </Typography>
                                        <Typography variant='caption' component='p' className='caption-text'>
                                            AVERAGE COST FOR TWO PEOPLE
                                    </Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id='items-checkout-container'>
                            {/**
                             * The list of menu items available in the restaurant along with their price
                             */}
                            <div className='items-container'>
                                {this.state.restaurantDetails.categories.map(category => (
                                    <div key={category.id}>
                                        {/**
                                         * Show the category name
                                         */}
                                        <Typography className={classes.category}>
                                            <span className='category-name'>{category.category_name}</span>
                                        </Typography>
                                        <Divider />
                                        {category.item_list.map(item => (
                                            <div className='menu-item-section' key={item.id}>
                                                {/**
                                                 * Show the circle based on item type red(non veg)/green(veg)
                                                 */}
                                                {'VEG' === item.item_type && <FontAwesomeIcon icon={faCircle} className='fa-circle-green' />}
                                                {'NON_VEG' === item.item_type && <FontAwesomeIcon icon={faCircle} className='fa-circle-red' />}

                                                <Typography className={classes.menuItem}>
                                                    <span className='menu-item'>{item.item_name}</span>
                                                </Typography>
                                                {/**
                                                 * Show rupee symbol and the price of the item with a plus sign icon to add to cart
                                                 */}
                                                <span className='item-price wrap-white-space'>
                                                    <FontAwesomeIcon icon={faRupeeSign} className='fa-rupee' />{item.price.toFixed(2)}
                                                </span>
                                                <IconButton className={classes.addIcon} onClick={() => this.addItemClickHandler(item)}><AddIcon /></IconButton>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <div className='cart-checkout-container'>
                                <Card variant='outlined' className='cart-checkout-card'>
                                    {/**
                                     * Show the Cart icon with badge message and My Cart Card header
                                     */}
                                    <CardHeader
                                        avatar={
                                            <Badge color='primary' badgeContent={this.state.noOfItemsInCart} showZero invisible={!this.state.isBadgeVisible} classes={{ anchorOriginTopRightRectangle: classes.badge }}>
                                                <ShoppingCartIcon fontSize='default' />
                                            </Badge>
                                        }
                                        title='My Cart'
                                        titleTypographyProps={{
                                            variant: 'h6'
                                        }}>
                                    </CardHeader>

                                    <CardContent>
                                        {this.state.cartItems.map(cartItem =>
                                            <div className='cart-menu-item-section' key={'cart' + cartItem.id}>
                                                {/**
                                                 * Show the stop circle O based on item type red(non veg)/green(veg)
                                                 */}
                                                {'VEG' === cartItem.item_type && <FontAwesomeIcon icon={faStopCircle} className='fa-circle-green' />}
                                                {'NON_VEG' === cartItem.item_type && <FontAwesomeIcon icon={faStopCircle} className='fa-circle-red' />}

                                                <Typography className={classes.cartMenuItem}>
                                                    <span className='cart-menu-item'>{cartItem.item_name}</span>
                                                </Typography>
                                                {/**
                                                 * Show the quantity with plus and minus icons to increase or decrease quantity
                                                 */}
                                                <section className='item-quantity-section'>
                                                    <IconButton className={classes.minusBtn} onClick={() => this.removeItemFromCartHandler(cartItem)}>
                                                        <FontAwesomeIcon icon={faMinus} className='plus-minus-icon' size='1x' />
                                                    </IconButton>
                                                    <span>{cartItem.quantity}</span>
                                                    <IconButton className={classes.plusBtn} onClick={() => this.addItemToCartHandler(cartItem)}>
                                                        <FontAwesomeIcon icon={faPlus} className='plus-minus-icon' size='1x' />
                                                    </IconButton>
                                                </section>
                                                {/**
                                                 * Show rupee symbol and the price of the item with a plus sign icon to add to cart
                                                 */}
                                                <span className='cart-item-price wrap-white-space'>
                                                    <FontAwesomeIcon icon={faRupeeSign} className='fa-rupee' />
                                                    {cartItem.totalItemPrice.toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                        {/**
                                         * Show the Total amount of the cart, price of all items together
                                         */}
                                        <div className='total-amount'>
                                            <Typography>
                                                <span className='bold'>TOTAL AMOUNT</span>
                                            </Typography>
                                            <span className='bold wrap-white-space'>
                                                <FontAwesomeIcon icon={faRupeeSign} className='fa-rupee' />
                                                {this.state.cartTotalAmount.toFixed(2)}
                                            </span>
                                        </div>
                                    </CardContent>
                                    <Button variant='contained' color='primary' onClick={this.checkoutClickHandler} fullWidth>Checkout</Button>
                                </Card>
                            </div>
                        </div>
                        {/**
                         * Show the snack bar at the bottom left of the page
                         * auto hides after 10 seconds, close icon is added to close if needed before the auto hide timesout
                         */}
                        <Snackbar
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            open={this.state.showSnackbar}
                            autoHideDuration={10000}
                            onClose={this.handleClose}
                            TransitionComponent={this.state.transition}
                            message={this.state.snackBarMsg}
                            action={
                                /**
                                 * Show close button to close the snackbar if the user wishes to
                                 */
                                <React.Fragment>
                                    <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleClose}>
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </React.Fragment>
                            } />
                    </div>
                }
            </div>
        )
    }
}

export default withStyles(styles)(Details);