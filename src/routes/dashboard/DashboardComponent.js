import React, { useState, useEffect } from 'react';
import { Column, Row } from 'simple-flexbox';
import { createUseStyles } from 'react-jss';
import MiniCardComponent from 'components/cards/MiniCardComponent';
import TodayTrendsComponent from './TodayTrendsComponent';
import axios from 'axios';

const useStyles = createUseStyles({
    cardsContainer: {
        marginRight: -30,
        marginTop: -30
    },
    cardRow: {
        marginTop: 30,
        '@media (max-width: 768px)': {
            marginTop: 0
        }
    },
    miniCardContainer: {
        flexGrow: 1,
        marginRight: 30,
        '@media (max-width: 768px)': {
            marginTop: 30,
            maxWidth: 'none'
        }
    },
    todayTrends: {
        marginTop: 30
    },
    lastRow: {
        marginTop: 30
    },
    unresolvedTickets: {
        marginRight: 30,
        '@media (max-width: 1024px)': {
            marginRight: 0
        }
    },
    tasks: {
        marginTop: 0,
        '@media (max-width: 1024px)': {
            marginTop: 30
        }
    }
});

const DashboardComponent = () => {
    const [grados, setGrados] = useState(0);
    const classes = useStyles();
    const [isTheCoffeeBoiling, setIsCoffeeBoiling] = useState(false);
    const [coffeTemp, setCoffeTemp] = useState(0);
    const [coffeeTempHistory, setCoffeeTempHistory] = useState([{ x: 0, y: 0 }]);
    const accessToken = process.env.REACT_APP_PHOTON_ACCESS_TOKEN;
    const deviceID = process.env.REACT_APP_PHOTON_DEVICE_ID;
    const url = 'https://api.particle.io/v1/devices/' + deviceID + '/boilCoffee';

    const boilCoffee = () => {
        axios
            .post(url, {
                params: 'on',
                access_token: accessToken
            })
            .catch(() => {});
        setIsCoffeeBoiling(true);
    };

    const stopBoilingCoffee = () => {
        axios
            .post(url, {
                params: 'off',
                access_token: accessToken
            })
            .catch(() => {});
        setIsCoffeeBoiling(false);
    };

    // Get coffe temperature from endpoitn
    const getCoffeTemp = () => {
        const requestURL = `https://api.particle.io/v1/devices/${deviceID}/coffeetemp/?access_token=${accessToken}`;
        axios
            .get(requestURL)
            .then(({ data }) => {
                data !== undefined && setCoffeTemp(data.result);
                coffeeTempHistory.push({ x: coffeeTempHistory.length, y: data.result });
                setCoffeeTempHistory(coffeeTempHistory);
            })
            .catch(() => {
                setCoffeTemp(0);
            });
    };

    // Update coffe temperature every 10 seconds
    useEffect(() => {
        getCoffeTemp();
        const interval = setInterval(() => {
            getCoffeTemp();
        }, 10000);

        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, []);

    // Update weather just on mount
    useEffect(() => {
        let requestURL = `//api.openweathermap.org/data/2.5/weather?lat=25.4237&lon=-101.037&appid=${process.env.REACT_APP_OMW_TOKEN}&units=metric`;
        axios
            .get(requestURL)
            .then(({ data }) => {
                data.main !== undefined && setGrados(data.main.temp);
            })
            .catch(() => {
                setGrados(0);
            });
    }, [setGrados]);

    return (
        <Column>
            <Row
                className={classes.cardsContainer}
                wrap
                flexGrow={1}
                horizontal='space-between'
                breakpoints={{
                    768: 'column'
                }}
            >
                <Row
                    className={classes.cardRow}
                    wrap
                    flexGrow={1}
                    horizontal='space-between'
                    breakpoints={{
                        384: 'column'
                    }}
                >
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='Temperatura actual del café'
                        value={`${coffeTemp.toFixed(2)}°`}
                    />
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='Temperatura recomendada de café'
                        value={`${(((grados * 15) / 100) * 15 + 48).toFixed(2)} C°`}
                    />{' '}
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='Temperatura en SLW'
                        value={`${grados} C°`}
                    />{' '}
                </Row>{' '}
                <Row
                    className={classes.cardRow}
                    wrap
                    flexGrow={1}
                    horizontal='space-between'
                    breakpoints={{
                        384: 'column'
                    }}
                >
                    <div
                        style={{ padding: '0px' }}
                        onClick={() => (isTheCoffeeBoiling ? stopBoilingCoffee() : boilCoffee())}
                    >
                        {!isTheCoffeeBoiling ? (
                            <MiniCardComponent
                                className={classes.miniCardContainer}
                                title='Calentar'
                                value='café'
                            />
                        ) : (
                            <MiniCardComponent
                                className={classes.miniCardContainer}
                                title='Detener'
                                value='café'
                            />
                        )}
                    </div>
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title={'Enero'}
                        value={new Date().getDate()}
                    />{' '}
                </Row>{' '}
            </Row>{' '}
            <div className={classes.todayTrends}>
                <TodayTrendsComponent coffeeTempHistory={coffeeTempHistory} />
            </div>{' '}
            <Row
                horizontal='space-between'
                className={classes.lastRow}
                breakpoints={{
                    1024: 'column'
                }}
            ></Row>{' '}
        </Column>
    );
};

export default DashboardComponent;
