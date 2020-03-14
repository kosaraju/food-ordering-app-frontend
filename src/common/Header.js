import { Fade, withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CloseIcon from '@material-ui/icons/Close';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import SearchIcon from '@material-ui/icons/Search';
import React, { Component } from 'react';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import './Header.css';

/**
 * Custom Styles used to customize material ui components
 * @param {*} theme
 */
const styles = theme => ({
    /* Style the fast food logo */
    logo: {
        color: 'white',
        'font-size': 'xx-large',
        margin: '15px 20px'
    },
    /* Style the search input text box with color, margin & border*/
    searchRestaurantTextInput: {
        color: 'white',
        margin: '10px',
        /* Set the border to white after selecting the text box */
        '&:after': {
            'border-bottom': '2px solid white',
        },
        'padding-bottom': '2px'
    },
    /* Set the margin, padding for login button */
    loginBtn: {
        margin: '10px 15px 10px 5px',
        'padding-top': '8px',
        'padding-bottom': '8px'
    },
    /* Set the margin, padding for Profile button */
    profileBtn: {
        margin: '10px 15px 10px 5px',
        'padding-top': '8px',
        'padding-bottom': '8px'
    },
    /* Set the width of form input fields */
    formInputControl: {
        width: '80%'
    }

});

/**
 * Style the login/signup modal to position at the center of page
 */
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        maxHeight: '100vh',
        overflowY: 'auto'
    }
}

/**
 * Container to display the contents and align to center
 * @param {*} props 
 */
const TabContainer = function (props) {
    return (
        <Typography component='div' className='tab-container'>
            {props.children}
        </Typography>
    );
}

class Header extends Component {

    constructor() {
        super();
        /**
         * Set the state with all the required fields and values
         */
        this.state = {
            modalIsOpen: false,
            value: 0,
            isUserLoggedIn: sessionStorage.getItem('access-token') != null,
            showMenu: false,
            showSnackbar: false,
            snackBarMsg: '',
            transition: Fade,
            loggedUserFirstName: sessionStorage.getItem('userFirstName') != null ? sessionStorage.getItem('userFirstName') : '',
            contactNo: '',
            contactNoRequired: 'dispNone',
            invalidLoginContactNo: 'dispNone',
            loginPassword: '',
            loginPasswordRequired: 'dispNone',
            loginFailureMsg: '',
            firstName: '',
            firstNameRequired: 'dispNone',
            lastName: '',
            email: '',
            emailRequired: 'dispNone',
            invalidEmail: 'dispNone',
            signupPassword: '',
            signupPasswordRequired: 'dispNone',
            invalidSignupPassword: 'dispNone',
            signupContact: '',
            signupContactRequired: 'dispNone',
            invalidSignupContactNo: 'dispNone',
            signupFailureMsg: ''
        }
    }

    /**
     * Click handler for login button on header
     * Opens the login/Signup modal for the customer to signup or login
     * reset the field values for the modal tabs
     */
    loginClickHandler = () => {
        // Hide/unhide the badge in details page
        if (this.props.toggleBadgeVisibility) {
            this.props.toggleBadgeVisibility();
        }
        this.setState({
            modalIsOpen: true,
            value: 0,
            contactNo: '',
            contactNoRequired: 'dispNone',
            invalidLoginContactNo: 'dispNone',
            loginPassword: '',
            loginPasswordRequired: 'dispNone',
            loginFailureMsg: '',
            firstName: '',
            firstNameRequired: 'dispNone',
            lastName: '',
            email: '',
            emailRequired: 'dispNone',
            invalidEmail: 'dispNone',
            signupPassword: '',
            signupPasswordRequired: 'dispNone',
            invalidSignupPassword: 'dispNone',
            signupContact: '',
            signupContactRequired: 'dispNone',
            invalidSignupContactNo: 'dispNone',
            signupFailureMsg: ''
        });
    }

    /**
     * Handler for on close of login/signup modal
     * Hides the Modal and shows the page
     */
    closeModalHandler = () => {
        // Hide/unhide the badge in details page
        if (this.props.toggleBadgeVisibility) {
            this.props.toggleBadgeVisibility();
        }
        this.setState({ modalIsOpen: false });
    }

    /**
     * Switching the tabs on the login/signup modal
     */
    tabChangeHandler = (event, value) => {
        this.setState({ value });
    }

    /**
     * prevent default submission of form
     */
    handleSubmit = (event) => {
        event.preventDefault();
    }

    /**
     * Set the value of input field to state for contact no
     */
    inputContactNoChangeHandler = (e) => {
        this.setState({ contactNo: e.target.value })
    }

    /**
     * Set the value of input field to state for password
     */
    inputPasswordChangeHandler = (e) => {
        this.setState({ loginPassword: e.target.value });
    }

    /**
     * Validate input values for Login tab
     * checks if the contactNo and password are keyed in and if contactNo is in expected mobile number format
     * Error messages will be shown if inputs are not provided and if any failure from the server
     */
    tabLoginClickHandler = () => {
        this.setState({ loginFailureMsg: '' });
        // check for empty field validation, show error message if empty
        this.state.contactNo === '' ? this.setState({ contactNoRequired: 'dispBlock', invalidLoginContactNo: 'dispNone' }) : this.setState({ contactNoRequired: 'dispNone', invalidLoginContactNo: 'dispNone' });
        this.state.loginPassword === '' ? this.setState({ loginPasswordRequired: 'dispBlock' }) : this.setState({ loginPasswordRequired: 'dispNone' });

        let contactNoPattern = new RegExp('^\\d{10}$');

        // check if the contactNo is 10 digits or not
        if (this.state.contactNo !== '' && !contactNoPattern.test(this.state.contactNo)) {
            this.setState({ contactNoRequired: 'dispNone', invalidLoginContactNo: 'dispBlock' });
        } else if (this.state.contactNo !== '' && this.state.loginPassword !== '') {
            // both the contactNo and password are keyed in, access the login api of backend
            let thisComponent = this;
            let xhr = new XMLHttpRequest();

            xhr.addEventListener('readystatechange', function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        let response = JSON.parse(this.response);
                        // Set the user first name and access token to session storage
                        sessionStorage.setItem('userFirstName', response.first_name);
                        sessionStorage.setItem('access-token', this.getResponseHeader('access-token'));
                        thisComponent.setState({
                            isUserLoggedIn: true,
                            loggedUserFirstName: response.first_name,
                            showSnackbar: true,
                            snackBarMsg: 'Logged in successfully!'
                        });
                        // Close the modal after successful login
                        thisComponent.closeModalHandler();
                    } else if (this.status === 401) {
                        // Authentication failure from Server
                        let response = JSON.parse(this.responseText);
                        if ('ATH-001' === response.code || 'ATH-002' === response.code) {
                            thisComponent.setState({ loginFailureMsg: response.message });
                        }
                    }
                }
            });
            let data = null;
            // convert the credentials to Base64 format for Basic authorization
            let authorization = window.btoa(this.state.contactNo + ':' + this.state.loginPassword);
            xhr.open('POST', this.props.baseUrl + '/customer/login');
            xhr.setRequestHeader('Authorization', 'Basic ' + authorization);
            xhr.setRequestHeader('Cache-Control', 'no-cache');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(data);
        }
    }

    /**
     * Show the menu options on click of profile in the header
     */
    profileClickHandler = (event) => {
        this.setState({
            showMenu: !this.state.showMenu,
            anchorEl: this.state.anchorEl != null ? null : event.currentTarget
        });
    }

    /**
     * Logout the user and clear the session storage
     */
    logoutClickHandler = () => {
        let xhr = new XMLHttpRequest();
        let thisComponent = this;
        xhr.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                // Api response can be success or authorization failure due to already logged out or session expiry
                if (this.status === 200 || this.status === 403) {
                    // on successful logout, remove the access token and user first name from session
                    // If in case already logged out/session expired, still clear the token info in session
                    sessionStorage.removeItem('userFirstName');
                    sessionStorage.removeItem('access-token');
                    thisComponent.setState({
                        isUserLoggedIn: false
                    });
                }
            }
        });
        let data = null;
        xhr.open('POST', this.props.baseUrl + '/customer/logout');
        // set the bearer access token to invalidate the session at the backend
        xhr.setRequestHeader('authorization', 'Bearer ' + sessionStorage.getItem('access-token'));
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(data);
    }

    /**
     * Set the value of input field to state for first name
     */
    inputFirstNameChangeHandler = (e) => {
        this.setState({ firstName: e.target.value });
    }

    /**
     * Set the value of input field to state for last name
     */
    inputLastNameChangeHandler = (e) => {
        this.setState({ lastName: e.target.value });
    }

    /**
     * Set the value of input field to state for signup email
     */
    inputEmailChangeHandler = (e) => {
        this.setState({ email: e.target.value });
    }

    /**
     * Set the value of input field to state for signup password
     */
    inputSignupPasswordChangeHandler = (e) => {
        this.setState({ signupPassword: e.target.value });
    }

    /**
     * Set the value of input field to state for signup password
     */
    inputSignupContactChangeHandler = (e) => {
        this.setState({ signupContact: e.target.value });
    }

    /**
     * Validate input values for Signup tab
     * checks if all the fields other than last name are keyed in or not
     * validates the email, password, contact number formats and throws invalid error if not aligned with the format
     * Error messages will be shown if inputs are not provided and if any failure from the server
     */
    tabSignupClickHandler = () => {
        this.setState({ signupFailureMsg: '' });
        let proceedSignup = true;
        let firstNameRequired = 'dispNone';
        let emailRequired = 'dispNone';
        let signupPasswordRequired = 'dispNone';
        let signupContactRequired = 'dispNone';
        let invalidEmail = 'dispNone';
        let invalidSignupPassword = 'dispNone';
        let invalidSignupContactNo = 'dispNone';
        // check for empty field validation, show error message if empty
        // if any of the validation fails for any field, update proceedSignup
        // to false to halt the signup trigger to backend
        if (this.state.firstName === '') {
            firstNameRequired = 'dispBlock';
            proceedSignup = false;
        }
        if (this.state.email === '') {
            emailRequired = 'dispBlock';
            proceedSignup = false;
        }
        if (this.state.signupPassword === '') {
            signupPasswordRequired = 'dispBlock';
            proceedSignup = false;
        }
        if (this.state.signupContact === '') {
            signupContactRequired = 'dispBlock';
            proceedSignup = false;
        }
        let emailPattern = new RegExp('^[\\w-_\\.+]*[\\w-_\\.]@([\\w]+\\.)+[\\w]+[\\w]$');

        // validate if the email entered is in the right pattern
        if (this.state.email !== '' && !emailPattern.test(this.state.email)) {
            // show invalid email error message
            invalidEmail = 'dispBlock';
            proceedSignup = false;
        }

        // (?=.*[A-Z]) Match at least one Capital letter
        // (?=.*[a-z]) Match at least one Small letter
        // (?=.*\d) at least one digit
        // (?=.*[#@$%&*!^]) at least one among the listed special characters
        // (.*) remaining can be any character
        // {8,} length at least 8
        let passwordPattern = new RegExp('(?=^.{8,}$)(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[#@$%&*!^])(.*)');
        // check if the password has at least a capital letter, a small letter, a number and a special character
        if (this.state.signupPassword !== '' && !passwordPattern.test(this.state.signupPassword)) {
            // show invalid password error message
            invalidSignupPassword = 'dispBlock';
            proceedSignup = false;
        }

        let contactNoPattern = new RegExp('^\\d{10}$');

        // check if the contactNo is 10 digits or not
        if (this.state.signupContact !== '' && !contactNoPattern.test(this.state.signupContact)) {
            // show invalid contact no error message
            invalidSignupContactNo = 'dispBlock';
            proceedSignup = false;
        }

        // set all the error field validation displays to state
        this.setState({
            firstNameRequired: firstNameRequired,
            emailRequired: emailRequired,
            signupPasswordRequired: signupPasswordRequired,
            signupContactRequired: signupContactRequired,
            invalidEmail: invalidEmail,
            invalidSignupPassword: invalidSignupPassword,
            invalidSignupContactNo: invalidSignupContactNo
        });
        // If no validation error, proceed to signup to access the backend endpoint
        if (proceedSignup) {
            let xhr = new XMLHttpRequest();
            let thisComponent = this;
            xhr.addEventListener('readystatechange', function () {
                if (this.readyState === 4) {
                    // Registration is successful
                    if (this.status === 201) {
                        // Set the message to snackbar and show on the page
                        thisComponent.setState({
                            showSnackbar: true,
                            snackBarMsg: 'Registered successfully! Please login now!'
                        });
                        // call login click handler to reset the state and show a fresh modal
                        thisComponent.loginClickHandler();
                    } else if (this.status === 400) {
                        // Signup failure from Server
                        let response = JSON.parse(this.response);
                        if ('SGR-001' === response.code) {
                            thisComponent.setState({ signupFailureMsg: response.message });
                        }
                    }
                }
            })
            let data = {
                'contact_number': this.state.signupContact,
                'email_address': this.state.email,
                'first_name': this.state.firstName,
                'password': this.state.signupPassword
            };
            // Send last name only if it is entered by customer
            if (this.state.lastName !== '') {
                data.last_name = this.state.lastName;
            }
            let signupData = JSON.stringify(data);
            // access the signup endpoint and submit the data with all inputs
            xhr.open('POST', this.props.baseUrl + '/customer/signup');
            xhr.setRequestHeader('Cache-Control', 'no-cache');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(signupData);
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
            <div className='app-header'>
                {/**
                 * Show the Fast food icon
                 */}
                <FastfoodIcon className={classes.logo} />
                {this.props.pageId === 'home' &&
                    <div id='search-box-section'>
                        <Input
                            startAdornment={
                                /**
                                 * Show the magnifier Search icon inside the text box at the start
                                 */
                                <InputAdornment>
                                    <SearchIcon className='search-icon' />
                                </InputAdornment>
                            } onChange={(e) => {
                                this.props.searchBoxChangeHandler(e.target.value)
                            }}
                            placeholder='Search by Restaurant Name' className={classes.searchRestaurantTextInput} fullWidth />
                    </div>
                }

                {this.state.isUserLoggedIn ?
                    <section>
                        {/**
                         * Button showing the Account icon and logged in user first name 
                         */}
                        <Button variant='text' className={classes.profileBtn} onClick={this.profileClickHandler}><AccountCircleIcon className='user-account-icon' />
                            <span className='user-name'>{this.state.loggedUserFirstName}</span>
                        </Button>
                        {/**
                         * Options menu on click of Profile, to show My Profile and Logout
                        */}
                        <Menu
                            id='profile-menu'
                            anchorEl={this.state.anchorEl}
                            keepMounted
                            open={this.state.showMenu}
                            onClose={this.profileClickHandler}
                            className='profile-options-menu'>
                            <Link to='/profile' className="menu-option-link">
                                <MenuItem>
                                    <span className='menu-option'>My Profile</span>
                                </MenuItem>
                            </Link>
                            <MenuItem onClick={this.logoutClickHandler}>
                                <span className='menu-option'>Logout</span>
                            </MenuItem>
                        </Menu>
                    </section>
                    :
                    /**
                     * Login button with account circle icon
                     */
                    <Button variant='contained' color='default' className={classes.loginBtn} onClick={this.loginClickHandler}>
                        <AccountCircleIcon className='account-icon' />Login
                    </Button>
                }
                {/**
                 * Login/Signup customer modal with Login and Signup tabs
                 */}
                <Modal ariaHideApp={false} isOpen={this.state.modalIsOpen} contentLabel='Login' onRequestClose={this.closeModalHandler} style={customStyles}>
                    <Tabs className='tabs' value={this.state.value} onChange={this.tabChangeHandler}>
                        <Tab label='LOGIN' />
                        <Tab label='SIGNUP' />
                    </Tabs>
                    <form onSubmit={this.handleSubmit}>
                        {/**
                         * Show the login tab with contact no and password for the customer to login to application
                         */}
                        {this.state.value === 0 &&
                            <TabContainer>
                                <FormControl className={classes.formInputControl} required>
                                    <InputLabel htmlFor='contactNo'>Contact No</InputLabel>
                                    <Input id='contactNo' type='text' onChange={this.inputContactNoChangeHandler} value={this.state.contactNo} fullWidth />
                                    <FormHelperText className={this.state.contactNoRequired}>
                                        <span className='red'>required</span>
                                    </FormHelperText>
                                    <FormHelperText className={this.state.invalidLoginContactNo}>
                                        <span className='red'>Invalid Contact</span>
                                    </FormHelperText>
                                </FormControl>
                                <br /><br />
                                <FormControl className={classes.formInputControl} required>
                                    <InputLabel htmlFor='loginPassword'>Password</InputLabel>
                                    <Input id='loginPassword' type='password' onChange={this.inputPasswordChangeHandler} value={this.state.loginPassword} fullWidth />
                                    <FormHelperText className={this.state.loginPasswordRequired}>
                                        <span className='red'>required</span>
                                    </FormHelperText>
                                    {/**
                                     * Error Text message if in case the provided credentials doesn't match with the server database
                                     * records
                                     */}
                                    {this.state.loginFailureMsg !== '' &&
                                        <FormHelperText>
                                            <span className='red'>{this.state.loginFailureMsg}</span>
                                        </FormHelperText>
                                    }
                                </FormControl>
                                <br /><br />
                                <Button variant='contained' color='primary' onClick={this.tabLoginClickHandler}>Login</Button>
                            </TabContainer>
                        }
                        {/**
                         * Show the signup tab with first name, last name, email, password and contact no for the customer to signup to application
                         */}
                        {this.state.value === 1 &&
                            <TabContainer>
                                <FormControl className={classes.formInputControl} required>
                                    <InputLabel htmlFor='firstName'>First Name</InputLabel>
                                    <Input id='firstName' type='text' onChange={this.inputFirstNameChangeHandler} value={this.state.firstName} fullWidth />
                                    <FormHelperText className={this.state.firstNameRequired}>
                                        <span className='red'>required</span>
                                    </FormHelperText>
                                </FormControl>
                                <br /><br />
                                <FormControl className={classes.formInputControl}>
                                    <InputLabel htmlFor='lastName'>Last Name</InputLabel>
                                    <Input id='lastName' type='text' onChange={this.inputLastNameChangeHandler} value={this.state.lastName} fullWidth />
                                </FormControl>
                                <br /><br />
                                <FormControl className={classes.formInputControl} required>
                                    <InputLabel htmlFor='email'>Email</InputLabel>
                                    <Input id='email' type='email' onChange={this.inputEmailChangeHandler} value={this.state.email} fullWidth />
                                    <FormHelperText className={this.state.emailRequired}>
                                        <span className='red'>required</span>
                                    </FormHelperText>
                                    <FormHelperText className={this.state.invalidEmail}>
                                        <span className='red'>Invalid Email</span>
                                    </FormHelperText>
                                </FormControl>
                                <br /><br />
                                <FormControl className={classes.formInputControl} required>
                                    <InputLabel htmlFor='signupPassword'>Password</InputLabel>
                                    <Input id='signupPassword' type='password' onChange={this.inputSignupPasswordChangeHandler} value={this.state.signupPassword} fullWidth />
                                    <FormHelperText className={this.state.signupPasswordRequired}>
                                        <span className='red'>required</span>
                                    </FormHelperText>
                                    <FormHelperText className={this.state.invalidSignupPassword}>
                                        <span className='red'>Password must contain at least one capital letter, one small letter, one number, and one special character</span>
                                    </FormHelperText>
                                </FormControl>
                                <br /><br />
                                <FormControl className={classes.formInputControl} required>
                                    <InputLabel htmlFor='signupContact'>Contact No</InputLabel>
                                    <Input id='signupContact' type='text' onChange={this.inputSignupContactChangeHandler} value={this.state.signupContact} fullWidth />
                                    <FormHelperText className={this.state.signupContactRequired}>
                                        <span className='red'>required</span>
                                    </FormHelperText>
                                    <FormHelperText className={this.state.invalidSignupContactNo}>
                                        <span className='red'>Contact No. must contain only numbers and must be 10 digits long</span>
                                    </FormHelperText>
                                    {/**
                                     * Error Text message if in case the provided contact number is already registered, error from server backend
                                     */}
                                    {this.state.signupFailureMsg !== '' &&
                                        <FormHelperText>
                                            <span className='red'>{this.state.signupFailureMsg}</span>
                                        </FormHelperText>
                                    }
                                </FormControl>
                                <br /><br />
                                <Button variant='contained' color='primary' onClick={this.tabSignupClickHandler}>Signup</Button>
                            </TabContainer>
                        }
                    </form>
                </Modal>
                {/**
                 * Show the snack bar at the bottom left of the page
                 * auto hides after 30 seconds, close icon is added to close if needed before the auto hide timesout
                 */}
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.showSnackbar}
                    autoHideDuration={30000}
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
        );
    }
}

export default withStyles(styles)(Header);