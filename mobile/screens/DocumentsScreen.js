import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, ScrollView, Platform, Alert } from 'react-native';
import { API_URL } from '../config';

const COLORS = {
    paper: '#F4EFE6',
    card: '#FFFDF8',
    ink: '#1F2A44',
    muted: '#8A8577',
    line: '#E2DACB',
    swissRed: '#D52B1E',
};

const MONO = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' });

const daysLeft = (expiresAt) => {
    const diff = new Date(expiresAt) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const getStatus = (doc) => {
    const days = daysLeft(doc.expires_at);
    if (days < 0) {
        return { label: 'EXPIRED', color: '#D52B1E', bg: '#FBE4E1' };
    } else if (days <= doc.remind_days_before) {
        return { label: 'SOON', color: '#C27A12', bg: '#FCEFD9' };
    } else {
        return { label: 'VALID', color: '#2F7D5B', bg: '#E2F1E9' };
    }
};

export default function DocumentsScreen({ token, onLogout }) {
    const [documents, setDocuments] = useState([]);
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [expiresAt, setExpiresAt] = useState("");

    const loadDocuments = async () => {
        const response = await fetch(API_URL + '/documents', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        });

        const docs = await response.json();
        if (response.status === 401) {
            onLogout();
            return;
        }
        if (!response.ok) {
            console.log('Error loading documents:', docs);
            return;
        }
        setDocuments(docs);
    };

    useEffect(() => {
        if (token) {
            loadDocuments();
        }
    }, [token]);

    const handleAddDocument = async () => {
        const response = await fetch(API_URL + '/documents', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({ name: name, type: type, expires_at: expiresAt }),
        });

        if (response.status === 401) {
            onLogout();
            return;
        }
        if (response.ok) {
            loadDocuments();
            setName("");
            setType("");
            setExpiresAt("");
        }
    };

    const handleDelete = async (id) => {
        const response = await fetch(API_URL + '/documents/' + id, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        });

        if (response.status === 401) {
            onLogout();
            return;
        }
        if (response.ok) {
            loadDocuments();
        }
    };

    const confirmDelete = (id) => {
        if (Platform.OS === 'web') {
            if (window.confirm('Are you sure?')) {
                handleDelete(id);
            }
        } else {
            Alert.alert('Delete document', 'Are you sure?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => handleDelete(id) },
            ]);
        }
    };

    const expiredCount = documents.filter((doc) => getStatus(doc).label === 'EXPIRED').length;
    const soonCount = documents.filter((doc) => getStatus(doc).label === 'SOON').length;
    const validCount = documents.filter((doc) => getStatus(doc).label === 'VALID').length;

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <View style={styles.brand}>
                    <View style={styles.cross}>
                        <View style={styles.crossBarH} />
                        <View style={styles.crossBarV} />
                    </View>
                    <Text style={styles.title}>DocReminder</Text>
                </View>
                <Pressable onPress={onLogout}>
                    <Text style={styles.logout}>Log out</Text>
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.stats}>
                    <View style={styles.stat}>
                        <Text style={[styles.statNumber, { color: '#D52B1E' }]}>{expiredCount}</Text>
                        <Text style={styles.statLabel}>EXPIRED</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={[styles.statNumber, { color: '#C27A12' }]}>{soonCount}</Text>
                        <Text style={styles.statLabel}>SOON</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={[styles.statNumber, { color: '#2F7D5B' }]}>{validCount}</Text>
                        <Text style={styles.statLabel}>VALID</Text>
                    </View>
                </View>

                {documents.length === 0 && (
                    <Text style={styles.empty}>Your folder is empty. Add your first document below.</Text>
                )}

                {documents.map((doc) => {
                    const status = getStatus(doc);
                    const days = daysLeft(doc.expires_at);

                    return (
                        <View key={doc.id} style={styles.ticket}>
                            <View style={[styles.stub, { backgroundColor: status.bg }]}>
                                <Text style={[styles.stubNumber, { color: status.color }]}>{Math.abs(days)}</Text>
                                <Text style={[styles.stubLabel, { color: status.color }]}>
                                    {days < 0 ? 'DAYS AGO' : 'DAYS LEFT'}
                                </Text>
                            </View>

                            <View style={styles.perforation}>
                                {[...Array(7)].map((_, i) => (
                                    <View key={i} style={styles.dot} />
                                ))}
                            </View>

                            <View style={styles.ticketBody}>
                                <Text style={styles.ticketType}>{doc.type}</Text>
                                <Text style={styles.ticketName}>{doc.name}</Text>
                                <Text style={styles.ticketDate}>Expires {doc.expires_at}</Text>
                            </View>

                            <View style={[styles.stamp, { borderColor: status.color }]}>
                                <Text style={[styles.stampText, { color: status.color }]}>{status.label}</Text>
                            </View>

                            <Pressable onPress={() => confirmDelete(doc.id)} style={styles.remove}>
                                <Text style={styles.removeText}>×</Text>
                            </Pressable>
                        </View>
                    );
                })}

                <View style={styles.form}>
                    <Text style={styles.formTitle}>Add to your folder</Text>
                    <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name — e.g. Passport" placeholderTextColor={COLORS.muted} />
                    <TextInput style={styles.input} value={type} onChangeText={setType} placeholder="Type — e.g. passport" placeholderTextColor={COLORS.muted} />
                    <TextInput style={styles.input} value={expiresAt} onChangeText={setExpiresAt} placeholder="Expires — YYYY-MM-DD" placeholderTextColor={COLORS.muted} />
                    <Pressable onPress={handleAddDocument} style={styles.addButton}>
                        <Text style={styles.addButtonText}>Add document  ＋</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: COLORS.paper },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 56,
        paddingBottom: 16,
    },
    brand: { flexDirection: 'row', alignItems: 'center' },
    cross: {
        width: 28,
        height: 28,
        borderRadius: 6,
        backgroundColor: COLORS.swissRed,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    crossBarH: { position: 'absolute', width: 16, height: 5, backgroundColor: '#fff' },
    crossBarV: { position: 'absolute', width: 5, height: 16, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: '800', color: COLORS.ink, letterSpacing: -0.5 },
    logout: { color: COLORS.ink, fontWeight: '600', textDecorationLine: 'underline' },

    content: { padding: 20, paddingTop: 4 },

    stats: { flexDirection: 'row', marginBottom: 20 },
    stat: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: COLORS.ink,
    },
    statNumber: { fontSize: 28, fontWeight: '800', fontFamily: MONO },
    statLabel: { fontSize: 11, fontWeight: '700', color: COLORS.ink, letterSpacing: 2, marginTop: 2 },

    empty: { textAlign: 'center', color: COLORS.muted, marginVertical: 24, fontStyle: 'italic' },

    ticket: {
        flexDirection: 'row',
        backgroundColor: COLORS.card,
        borderRadius: 14,
        marginBottom: 14,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.line,
    },
    stub: { width: 86, alignItems: 'center', justifyContent: 'center', paddingVertical: 18 },
    stubNumber: { fontSize: 30, fontWeight: '800', fontFamily: MONO },
    stubLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 1.5, marginTop: 2 },
    perforation: { width: 2, justifyContent: 'space-evenly', alignItems: 'center' },
    dot: { width: 2, height: 4, backgroundColor: COLORS.line, borderRadius: 1 },
    ticketBody: { flex: 1, padding: 16, paddingRight: 40 },
    ticketType: { fontSize: 10, fontWeight: '700', color: COLORS.muted, letterSpacing: 2, textTransform: 'uppercase' },
    ticketName: { fontSize: 18, fontWeight: '700', color: COLORS.ink, marginTop: 4 },
    ticketDate: { fontSize: 12, color: COLORS.muted, marginTop: 6, fontFamily: MONO },

    stamp: {
        position: 'absolute',
        right: 36,
        bottom: 12,
        borderWidth: 2,
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        transform: [{ rotate: '-8deg' }],
        opacity: 0.85,
    },
    stampText: { fontSize: 11, fontWeight: '900', letterSpacing: 2 },

    remove: { position: 'absolute', top: 6, right: 10, padding: 4 },
    removeText: { fontSize: 20, color: COLORS.muted },

    form: {
        marginTop: 12,
        padding: 20,
        borderRadius: 14,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: COLORS.line,
    },
    formTitle: { fontSize: 16, fontWeight: '800', color: COLORS.ink, marginBottom: 12 },
    input: {
        borderBottomWidth: 2,
        borderBottomColor: COLORS.ink,
        paddingVertical: 10,
        marginBottom: 14,
        fontSize: 15,
        color: COLORS.ink,
    },
    addButton: {
        backgroundColor: COLORS.ink,
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 4,
    },
    addButtonText: { color: COLORS.paper, fontWeight: '800', fontSize: 15, letterSpacing: 0.5 },
});
