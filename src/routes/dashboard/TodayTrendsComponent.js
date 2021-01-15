import React, { useState, useEffect } from 'react';
import { Column, Row } from 'simple-flexbox';
import { createUseStyles, useTheme } from 'react-jss';
import LineChart from 'react-svg-line-chart';
import axios from 'axios';

const useStyles = createUseStyles((theme) => ({
    container: {
        backgroundColor: '#FFFFFF',
        border: `1px solid ${theme.color.lightGrayishBlue2}`,
        borderRadius: 4,
        cursor: 'pointer'
    },
    graphContainer: {
        marginTop: 24,
        marginLeft: 0,
        marginRight: 0,
        width: '100%'
    },
    graphSection: {
        padding: 24
    },
    graphSubtitle: {
        ...theme.typography.smallSubtitle,
        color: theme.color.grayishBlue2,
        marginTop: 4,
        marginRight: 8
    },
    graphTitle: {
        ...theme.typography.cardTitle,
        color: theme.color.veryDarkGrayishBlue
    },
    legendTitle: {
        ...theme.typography.smallSubtitle,
        fontWeight: '600',
        color: theme.color.grayishBlue2,
        marginLeft: 8
    },
    separator: {
        backgroundColor: theme.color.lightGrayishBlue2,
        width: 1,
        minWidth: 1
    },
    statContainer: {
        borderBottom: `1px solid ${theme.color.lightGrayishBlue2}`,
        padding: '24px 32px 24px 32px',
        height: 'calc(114px - 48px)',
        '&:last-child': {
            border: 'none'
        }
    },
    stats: {
        borderTop: `1px solid ${theme.color.lightGrayishBlue2}`,
        width: '100%'
    },
    statTitle: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: '22px',
        letterSpacing: '0.3px',
        textAlign: 'center',
        color: theme.color.grayishBlue2,
        whiteSpace: 'nowrap',
        marginBottom: 6
    },
    statValue: {
        ...theme.typography.title,
        textAlign: 'center',
        color: theme.color.veryDarkGrayishBlue
    }
}));

const TodayTrendsComponent = ({ coffeeTempHistory, distance }) => {
    const theme = useTheme();
    const classes = useStyles({ theme });
    const [nextActivation, setNextActivation] = useState('7:40am');
    const accessToken = process.env.REACT_APP_PHOTON_ACCESS_TOKEN;
    const deviceID = process.env.REACT_APP_PHOTON_DEVICE_ID;

    const getActivations = () => {
        let requestURL = `https://api.particle.io/v1/devices/${deviceID}/nextActivation/?access_token=${accessToken}`;
        axios
            .get(requestURL)
            .then(({ data }) => {
                setNextActivation(data.result);
            })
            .catch(() => {
                setNextActivation('9:40am');
            });
        requestURL = `https://api.particle.io/v1/devices/${deviceID}/lastActivation/?access_token=${accessToken}`;
    };

    // Update coffe temperature every 10 seconds
    useEffect(() => {
        getActivations();
        const interval = setInterval(() => {
            getActivations();
        }, 100000);
        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, []);

    useEffect(() => {}, []);

    function renderLegend(color, title) {
        return (
            <Row vertical='center'>
                <div style={{ width: 16, border: '2px solid', borderColor: color }}></div>
                <span className={classes.legendTitle}>{title}</span>
            </Row>
        );
    }

    function renderStat(title, value) {
        return (
            <Column
                flexGrow={1}
                className={classes.statContainer}
                vertical='center'
                horizontal='center'
            >
                <span className={classes.statTitle}>{title}</span>
                <span className={classes.statValue}>{value}</span>
            </Column>
        );
    }

    return (
        <Row
            flexGrow={1}
            className={classes.container}
            horizontal='center'
            breakpoints={{ 1024: 'column' }}
        >
            <Column
                wrap
                flexGrow={7}
                flexBasis='735px'
                className={classes.graphSection}
                breakpoints={{ 1024: { width: 'calc(100% - 48px)', flexBasis: 'auto' } }}
            >
                <Row wrap horizontal='space-between'>
                    <Column>
                        <span className={classes.graphTitle}>
                            Temperatura del café recientemente
                        </span>
                        <span className={classes.graphSubtitle}>
                            graficando desde{' '}
                            {`${new Date().getHours() % 12}:${
                                new Date().getMinutes().length > 1
                                    ? new Date().getMinutes()
                                    : `0${new Date().getMinutes()}`
                            }${new Date().getHours() / 12 > 1 ? 'pm' : 'am'}`}
                        </span>
                    </Column>
                    {renderLegend(theme.color.lightBlue, 'Today')}
                </Row>
                <div className={classes.graphContainer}>
                    <LineChart
                        data={coffeeTempHistory}
                        viewBoxWidth={500}
                        pointsStrokeColor={theme.color.lightBlue}
                        areaColor={theme.color.lightBlue}
                        areaVisible={true}
                    />
                </div>
            </Column>
            <Column className={classes.separator} breakpoints={{ 1024: { display: 'none' } }}>
                <div />
            </Column>
            <Column flexGrow={3} flexBasis='342px' breakpoints={{ 1024: classes.stats }}>
                {renderStat('Próxima activación', nextActivation)}
                {renderStat(
                    distance < 7
                        ? 'Se ha detectado una jarra, puede encender la cafetera'
                        : 'No se ha detectado una jarra'
                )}
                {renderStat(
                    'Hora actual',
                    `${new Date().getHours() % 12}:${new Date().getMinutes()}${
                        new Date().getHours() / 12 > 1 ? 'pm' : 'am'
                    }`
                )}
                {renderStat('Activaciones diarias promedio', '6')}
            </Column>
        </Row>
    );
};

export default TodayTrendsComponent;
