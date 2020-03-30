import * as React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Card, Icon, ListItem, Text,} from 'react-native-elements'
import TouchableScale from 'react-native-touchable-scale';

import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';

import {connect} from "react-redux";
import {Linking} from "expo";
import {GradientMask} from "../components/GradientMask";


const SECTIONS = [
    {
        name: 'Allgemein',
        description: 'Hier erhalten sie Informationen und offizielle Empfehlungen, die den Zweck haben sie vor einer Infektion ' +
            ' zu bewahren und die Verbreitung des Coronavirus in Deutschland einzudämmen.',
        image: require("../assets/images/corona.jpg"),
        index: 0,
        topics: [
            {
                name: 'Motive',
                description_title: 'Aufrechterhalten des Krankensystems',
                description: 'Um die Verfügbarkeit von Krankenhausbetten, medizinischer Ausrüstung, Fachpersonal und ' +
                    'damit auch der medizinischen Versorgung der uns nahestehenden Personen zu gewährleisten, ist es ' +
                    'unvermeidbar, dass jeder seinen Beitrag zur globalen Coronavirus-Pandemie leistet.',
                source: 'https://www.zusammengegencorona.de/'
            },
            {
                name: 'Quellen',
                description_title: 'Zuverlässigkeit',
                description: 'Hier dargestellte Informationen sind automatisch durch verschiedene Internetquellen ' +
                    'ermittelt worden. Wir verwenden den von der ECDC (European Centre for Disease Prevention and Control) ' +
                    'veröffentlichten Datensatz.',
                source: 'https://www.ecdc.europa.eu/'
            }
        ],
    },
    {
        name: 'Hygiene',
        index: 1,
        description: 'Erfahren sie, wie sie das Risiko einer Infektion für sich sowie den Menschen in ihrerer Umgebung ' +
            'durch grundlegende Hygieneregeln einschränken können.',
        image: require("../assets/images/hands.jpg"),
        topics: [
            {
                name: 'Hände     ',
                description_title: 'Richtig Händewaschen',
                description: 'Die Hände sind die häufigsten Übertrager von Infektionen. Das bedeutet, dass man mit ' +
                    'regelmäßigem und gründlichem Händewaschen das Risiko einer Ansteckung stark senkt. ',
                source: 'https://www.infektionsschutz.de/haendewaschen.html',
            },
            {
                name: 'Tröpchen',
                description_title: 'Hygiene beim Husten und Niesen',
                description: 'Da der Hauptübertragungsweg des Coronavirus die Tröpcheninfektion ist, sollte man beim ' +
                    'Husten und Niesen nicht einfach nur die eigene Hand vor den Mund halten und so andere über ' +
                    'gemeinsam benutzte Gegenstände anstecken.',
                source: 'https://www.infektionsschutz.de/hygienetipps/hygiene-beim-husten-und-niesen.html',
            }
        ],
    },
    {
        name: 'Verhalten',
        index: 2,
        description: 'Die wichtigste Maßnahme gegen die Ausbreitung des Coronavirus ist die "soziale Distanzierung". ' +
            'Wenn jeder möglichst Zuhause bleibt wird die Anzahl der Sitatuationen, bei denen man sich selbst, Bekannte ' +
            'oder Freme anstecken könnte, minimiert.',
        image: require("../assets/images/distance.jpg"),
        topics: [
            {
                name: 'Abstand    ',
                description_title: 'Abstand und Hilfe',
                description: 'Versuchen sie persönliche Begegnungen möglichst einzuschränken. Meiden sie Orte an denen ' +
                    'viele Menschen sind oder verkehren (Nicht zu Stoßzeiten einkaufen gehen; Öffentliche Verkehrsmittel). ' +
                    'Selbst in der Arbeit können sie mit einem bis zwei Metern Sicherheitsabstand die Risiken stark minimieren. ',
                source: 'https://www.infektionsschutz.de/coronavirus/verhalten.html',
            },{
                name: 'Quarantäne',
                description_title: 'Wann sollte man in die quarantäne?',
                description: 'Die Quarantäne dient der Isolierung von Personen mit einem hohen Infektionsrisiko. Auch ' +
                    'wenn diese nicht offiziell vom Gesundheitsamt verhängt wurde, sollte man sich selbst in diese Begeben, ' +
                    'wenn man innerhalb der letzten zwei Wochen engen Kontakt mit einer infizierten Person hatte oder ' +
                    'Symptome einer Erkrankung zeigt.',
                source: 'http://multimedia.gsb.bund.de/RKI/Flowcharts/covid19-quarantaene/',
            }]
    },
];

class Advices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeSections: [],
            collapsed: true,
            multipleSelect: false,
        }
    }

    setSections = sections => {
        this.setState({
            activeSections: (sections.includes(undefined) || this.state.activeSections.includes(sections[0])) ? [] : sections,
        });
    };

    renderHeader = (section, _, isActive) => {
        return (
            <TouchableScale
                onPress={() => this.setSections([section.index])}
            >
                <Card
                    containerStyle={{padding: 0}}
                    image={section.image}
                    component={TouchableScale}
                >
                    <View>
                        <GradientMask/>
                        <View>
                            <Text style={styles.sectionTitle}>{section.name}</Text>
                            <Text style={styles.sectionDescription}>{section.description}</Text>
                        </View>
                        {(isActive) ?
                            <Icon
                            type='material'
                            name='expand-less'
                            color='#00adb5' />
                            :
                            <Icon
                                type='material'
                                name='expand-more'
                                color='#00adb5' />
                        }

                    </View>
                </Card>
            </TouchableScale>
        );
    };

    renderContent(section, _, isActive) {
        return (
            <Animatable.View
                duration={400}
                style={[isActive ? styles.active : {}]}
                transition="backgroundColor"
            >
                    {section.topics.map(topic => (
                        <ListItem
                            key={topic.description_title}
                            Component={TouchableScale}
                            leftElement={<Text>{topic.name}</Text>}
                            title={topic.description_title}
                            subtitle={topic.description}
                            onPress={() => {
                                if (topic.source !== '') {
                                    Linking.openURL(topic.source).catch(err => alert("Die URL: " + topic.url + " konnte nicht aufgerufen werden"))
                                }
                            }}
                            bottomDivider
                            chevron={(topic.source !== '') ? {color: '#00adb5'} : false}
                        />
                    ))}
                <Animatable.Text animation={isActive ? 'bounceIn' : undefined}>
                    {section.content}
                </Animatable.Text>
            </Animatable.View>
        );
    }

    render() {
        const { multipleSelect, activeSections } = this.state;

        return (
            <View style={styles.container}>
                <ScrollView>
                    <Accordion
                        activeSections={activeSections}
                        sections={SECTIONS}
                        touchableComponent={TouchableOpacity}
                        expandMultiple={multipleSelect}
                        renderHeader={this.renderHeader}
                        renderContent={this.renderContent}
                        duration={400}
                        onChange={this.setSections}
                    />
                </ScrollView>
            </View>
        );
    }
}

Advices.navigationOptions = {
    header: null,
};

const mapStateToProps = (state) => {
    const { data } = state;
    return { data }
};

export default connect(mapStateToProps)(Advices);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#393e46',
        padding: 10,
    },
    title_container: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#eeeeee',
        margin: 5,
        marginBottom: 15,
    },
    title: {
        textAlign: 'justify',
        fontSize: 15,
        fontWeight: '300',
    },
    sectionTitle: {
        fontSize: 20,
    },
    sectionDescription: {

    },
    active: {
        marginTop: 10,
        marginHorizontal: 20,
    },
});
