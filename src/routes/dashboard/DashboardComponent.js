import React, { useState } from 'react';
import { Column, Row } from 'simple-flexbox';
import { createUseStyles } from 'react-jss';
import MiniCardComponent from 'components/cards/MiniCardComponent';
import TodayTrendsComponent from './TodayTrendsComponent';

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

const WeatherSLW = async ({setGrados}) => {
    const api_call = await fetch(`//api.openweathermap.org/data/2.5/weather?lat=25.4237&lon=-101.037&appid=45a937c494b3b5a1a1171c82c071a9a6&units=metric`);
    const data = await api_call.json();
    setGrados(data.main.temp);
}

function DashboardComponent() {
    const [grados, setGrados] = useState(0);
    const classes = useStyles();
    WeatherSLW({setGrados});
    return (
        <Column>
            <Row
                className={classes.cardsContainer}
                wrap
                flexGrow={1}
                horizontal='space-between'
                breakpoints={{ 768: 'column' }}
            >
                <Row
                    className={classes.cardRow}
                    wrap
                    flexGrow={1}
                    horizontal='space-between'
                    breakpoints={{ 384: 'column' }}
                >
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='Temperatura actual del café'
                        value='80°'
                    />
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='Temperatura recomendada de café'
                        value={`${((grados*80/100)*15+48).toFixed(2)} C°`}
                    />
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='Temperatura en SLW'
                        value={`${grados} C°`}
                    />
                </Row>
                <Row
                    className={classes.cardRow}
                    wrap
                    flexGrow={1}
                    horizontal='space-between'
                    breakpoints={{ 384: 'column' }}
                >
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='Cafés servidos'
                        value='43'
                    />
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title={'Enero'}
                        value={new Date().getDate()}
                    />
                </Row>
            </Row>
            <div className={classes.todayTrends}>
                <TodayTrendsComponent />
            </div>
            <Row
                horizontal='space-between'
                className={classes.lastRow}
                breakpoints={{ 1024: 'column' }}
            >
            </Row>
        </Column>
    );
}

export default DashboardComponent;
