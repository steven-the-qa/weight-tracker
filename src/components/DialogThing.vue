<script setup lang="ts">
    import { doc, serverTimestamp, setDoc, collection, DocumentReference, CollectionReference, addDoc} from "firebase/firestore";
    import { db } from '../firebase'
    import { getAuth } from 'firebase/auth'
    const user = getAuth().currentUser

    const props = defineProps({
        message: String
    })
    import { ref, reactive } from 'vue';
    const currentWeight = ref(null)
    const state = reactive({ currentWeight })
    const handleSubmit = async () => {
        try {
            if (user == null) return

            const userRef: DocumentReference = doc(db, 'users', user.uid)
            await setDoc(userRef, {
                currentWeight: state.currentWeight
            }, { merge: true })

            const weightEntriesRef: CollectionReference = collection(userRef, 'weightEntries')
            await addDoc(weightEntriesRef, {
                createdDate: serverTimestamp(),
                weight: state.currentWeight
            })

            document.getElementById('dialog')?.classList.replace('block', 'hidden')
        }
        catch (e) {
            console.error("Error adding document: ", e);
        }
    }
</script>


<template>
    <div id='dialog' class="hidden absolute inset-0 z-[100] bg-[#070707]">
        <div class="flex justify-center items-center h-48 w-96 bg-white">
            <p class="absolute top-2 right-4">X</p>
            <p>{{ props.message }}</p>
            <form @submit.prevent="handleSubmit" class="flex flex-col justify-center text-[#4B4B4B] text-lg h-[50%] tracking-wide">
                <div id="current-weight-group" class="flex flex-col mb-5 mx-3">
                    <label class="" for="current-weight">Add your current weight</label>
                    <input v-model="currentWeight" class="placeholder:text-[#BDBDBD] h-14 pl-3 mr-5 rounded-lg bg-white border border-[#BDBDBD]" type="number" id="current-weight" name="current-weight" step="0.01" placeholder="enter current weight" required>
                </div>
                <input class="mt-auto bg-[#2058E8] py-4 px-5 mx-3 rounded-xl text-white font-semibold" type="submit" value="Add weight" onsubmit="">
            </form>
        </div>
    </div>
</template>
