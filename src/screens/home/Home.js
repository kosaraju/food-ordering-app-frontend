import { faRupeeSign, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import Typography from '@material-ui/core/Typography';
import React, { Component } from "react";
import 'typeface-roboto';
import Header from '../../common/Header';
import './Home.css';

/**
 * Custom Styles used to customize material ui components
 * @param {*} theme
 */
const styles = theme => ({
    /** set the styles for  Grid*/
    root: {
        flexGrow: 1,
    },
    /** set the style for card text */
    cardText: {
        padding: '2%',
        minHeight: '145px',
        '@media(max-width:599px)': {
            minHeight: 'auto'
        }
    },
    /** set the style for categories displayed on a card */
    categories: {
        fontSize: 'initial',
        marginTop: '16%'
    },
    /** Style the card bottom section with margin and display flex */
    ratingAndPrice: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        whiteSpace: 'no-wrap',
        margin: '10px'
    },
    /** set style for rating box displayed in the card */
    ratingBox: {
        backgroundColor: 'rgb(234, 204, 94)',
        color: 'white',
        padding: '10px 15px',
        whiteSpace: 'nowrap',
        fontSize: 'small',
        width: '100px',
        display: 'flex',
        justifyContent: 'center'
    },
    /** Set the bottom margin for the star icon */
    faStarIcon: {
        marginBottom: '1px'
    },
    /** set style for rupees displayed in card */
    rupees: {
        marginRight: '6px',
        fontSize: 'small',
        whiteSpace: 'nowrap'
    }
})

class Home extends Component {

    constructor() {
        super();
        this.state = {
            restaurants: [],
            search: '',
            dispMessage: 'dispNone'
        }
    }

    /** this method will called before the components get mount */
    UNSAFE_componentWillMount() {
        let that = this;
        let xhrData = new XMLHttpRequest();
        let restaurants = null;
        xhrData.addEventListener("readystatechange", function () {
            // If the response from server is success
            if (this.readyState === 4 && this.status === 200) {
                // Set the restaurants data to state
                that.setState({
                    restaurants: JSON.parse(this.response).restaurants
                });
                that.setState({ dispMessage: 'dispNone' })
            }
        });
        xhrData.open("GET", this.props.baseUrl + '/restaurant');
        xhrData.send(restaurants);
    }

    /**
     * this method is used to search the restaurant according 
     * to restaurant name typed where 'searchValue' is the restaurant
     * name that needs to be searched
     */
    searchBoxChangeHandler = (searchValue) => {
        this.setState({ search: searchValue })
        //this will search restaurant, if searchValue is non-empty
        if (searchValue !== '' && searchValue !== null) {
            let that = this;
            let xhrData = new XMLHttpRequest();
            let restaurants = null;
            xhrData.addEventListener("readystatechange", function () {
                // If the response from server is success
                if (this.readyState === 4 && this.status === 200) {
                    // Set the restaurants data to state
                    that.setState({
                        restaurants: JSON.parse(this.response).restaurants
                    });
                    // If there are no restaurants matching with the search, show message as  No Restaurant found
                    if (that.state.restaurants !== null && that.state.restaurants.length === 0) {
                        that.setState({ dispMessage: 'dispBlock' });
                    } else {
                        that.setState({ dispMessage: 'dispNone' });
                    }
                }
            });
            // Call the back end endpoint with the search value
            xhrData.open("GET", this.props.baseUrl + '/restaurant/name/' + searchValue);
            xhrData.send(restaurants);

        } else {
            // If the search value is cleared, set the complete list of restaurants by calling get restaurant
            this.UNSAFE_componentWillMount();
        }
    }

    /** 
     * This method will be used to redirect to details page 
     * depeding upon the restaurant which is clicked
     * 'restaurantId' is uuid of restaurant which is clicked
     */
    cardClickHandler = (restaurantId) => {
        this.props.history.push("/restaurant/" + restaurantId);
    }

    render() {
        const { classes } = this.props;
        let restaurantsData = this.state.restaurants;
        return (
            <div>
                <Header pageId='home' baseUrl={this.props.baseUrl} searchBoxChangeHandler={this.searchBoxChangeHandler} />
                <div className='grid-container'>
                    <GridList cellHeight={"auto"} spacing={20} >
                        {restaurantsData !== [] && restaurantsData !== null && restaurantsData.map(restaurant => (
                            /**
                             * Grid container with resposive screen support, display cards inside grid based on
                             * screen size, very small screen size - 1, small screen width - 2, medium screen width - 3
                             * and desktop and above screens 4 cards will be shown
                             */
                            <Grid container item key={restaurant.id} className={classes.root} xs={12}
                                sm={6} md={4} lg={3} >
                                {/**
                                 * The Grid card with the image of restaurant, categories, rating and average price shown
                                 */}
                                <Card onClick={() => this.cardClickHandler(restaurant.id)}>
                                    <CardActionArea>
                                        {/**
                                         * Image of the restaurant
                                         */}
                                        <CardMedia
                                            component="img"
                                            alt={restaurant.restaurant_name}
                                            height="175"
                                            image={restaurant.photo_URL}
                                            title={restaurant.restaurant_name}
                                        />
                                        {/**
                                         * The restaurant details, like name and categories of food offered
                                         */}
                                        <CardContent>
                                            <div className={classes.cardText} >
                                                <Typography gutterBottom variant="h5" component="h2">
                                                    {restaurant.restaurant_name}
                                                </Typography>
                                                <Typography variant="subtitle2" component="p" className={classes.categories}>
                                                    {restaurant.categories}
                                                </Typography>
                                            </div>
                                        </CardContent>
                                        {/**
                                         * The bottom section of the card showing the number of ratings and average price for two
                                         */}
                                        <CardActions className={classes.ratingAndPrice}>
                                            <span className={classes.ratingBox}>
                                                <FontAwesomeIcon icon={faStar} className='faStarIcon' /> &nbsp;
                                                    <span> {restaurant.customer_rating}</span>&nbsp;({restaurant.number_customers_rated})
                                                </span>
                                            <Typography className={classes.rupees}>
                                                <FontAwesomeIcon icon={faRupeeSign} />
                                                {restaurant.average_price}
                                                &nbsp;for two
                                                </Typography>
                                        </CardActions>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </GridList>
                    <div className={this.state.dispMessage}>
                        <Typography>No restaurant with the given name.</Typography>
                    </div>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Home);