import React, { useState } from 'react';
import { Column, Row } from 'simple-flexbox';
import { createUseStyles } from 'react-jss';
import MiniCardComponent from 'components/cards/MiniCardComponent';
import TodayTrendsComponent from './TodayTrendsComponent';
import $ from 'jquery';

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

const WeatherSLW = async ({ setGrados }) => {
    const api_call = await fetch(
        `//api.openweathermap.org/data/2.5/weather?lat=25.4237&lon=-101.037&appid=${process.env.REACT_APP_OMW_TOKEN}&units=metric`
    );
    const data = await api_call.json();
    data.main?.temp ? setGrados(data.main.temp) : setGrados(0);
};

function DashboardComponent() {
    const [grados, setGrados] = useState(0);
    const classes = useStyles();
    const [isTheCoffeeBoiling, setIsCoffeeBoiling] = useState(false);
    const [coffeTemp, setCoffeTemp] = useState(0);
    WeatherSLW({
        setGrados
    });
    const accessToken = process.env.REACT_APP_PHOTON_ACCESS_TOKEN;
    const deviceID = process.env.REACT_APP_PHOTON_DEVICE_ID;
    const url = 'https://api.particle.io/v1/devices/' + deviceID + '/boilCoffee';

    const boilCoffee = () => {
        console.log('post is being made');
        $.post(url, {
            params: 'on',
            access_token: accessToken
        });
        setIsCoffeeBoiling(true);
    };
    const stopBoilingCoffee = () => {
        $.post(url, {
            params: 'off',
            access_token: accessToken
        });
        setIsCoffeeBoiling(false);
    };
    const getUrl = (var2get) => {
        let requestURL =
            'https://api.particle.io/v1/devices/' +
            deviceID +
            '/' +
            var2get +
            '/?access_token=' +
            accessToken;
        return requestURL;
    };
    $.getJSON(getUrl('coffeetemp'), function (json) {
        console.log(json.result);
        json.result ? setCoffeTemp(json.result) : setCoffeTemp(0);
    });
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
                        value={`${coffeTemp}°`}
                    />
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='Temperatura recomendada de café'
                        value={`${(((grados * 80) / 100) * 15 + 48).toFixed(2)} C°`}
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
                <TodayTrendsComponent />
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
}

export default DashboardComponent;
