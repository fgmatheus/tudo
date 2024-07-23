import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, TouchableOpacityProps, Text, ActivityIndicator, StyleSheet } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
    title: string
    isLoading?: boolean
    icon: keyof typeof Ionicons.glyphMap
}

export function Button({ 
    title, 
    isLoading = false, 
    icon, 
    ...rest
}: ButtonProps){
    return(
        <TouchableOpacity style={styles.buttonContainer} disabled={isLoading} activeOpacity={0.8} {...rest}>
            {isLoading ? (
                <ActivityIndicator color='white' />
            ):(
                <>
                    <Ionicons style={styles.buttonIcon} name={icon} />
                    <Text style={styles.buttonText}>{title}</Text>
                </>
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: "80%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        backgroundColor: '#000',
        padding: 22,
        borderRadius: 30,
    },
    buttonIcon: {
        color: '#fff',
        fontSize: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    }
})