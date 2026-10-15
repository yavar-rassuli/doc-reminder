import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from './theme';     
     export default function Logo() {

  return ( 
      <View style={styles.brand}>
                    <View style={styles.cross}>
                        <View style={styles.crossBarH} />
                        <View style={styles.crossBarV} />
                    </View>
                    <Text style={styles.title}>DocReminder</Text>
        </View>
     
   );
}


const styles = StyleSheet.create({
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
});
    