<script setup lang="ts">
    import { doc, serverTimestamp, setDoc, collection, DocumentReference, CollectionReference, addDoc} from "firebase/firestore";
    import { db } from '../firebase'
    import { getAuth } from 'firebase/auth'
    const user = getAuth().currentUser
    import { ref, reactive } from 'vue';
    import NumberInput from './NumberInput.vue';
    const currentWeight = ref(null)
    const state = reactive({ currentWeight })

    const triggerState = ref(false)

    const handleDialog = async () => {
        const dialog: HTMLElement = document.getElementById('dialog-container') as HTMLElement
        triggerState.value = !triggerState.value
        if (triggerState.value) {
            dialog.classList.replace('hidden', 'block')
        }
        else {
            dialog.classList.replace('block', 'hidden')
        }
    }

    const closeDialog = () => {
        document.getElementById('dialog-container')?.classList.replace('block', 'hidden')
        handleDialog()
    }

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

            closeDialog()
        }
        catch (e) {
            console.error("Error adding document: ", e);
        }
    }
</script>

<template>
        <div id='dialog-container' class="hidden absolute top-0 left-0 h-full w-full z-[100] bg-gray-500 opacity-75 flex justify-center items-center min-w-[300px]">
        <div data-testid='dialog-content' class="relative flex flex-col justify-center items-center h-54 w-80 bg-white my-[50%] pl-5 rounded-xl">
            <p data-testid='close-dialog' :onclick="closeDialog" class="inline-flex absolute top-[1rem] right-[1rem] text-2xl cursor-pointer">✕</p>
            <form @submit.prevent="handleSubmit" class="flex flex-col justify-center items-start text-[#4B4B4B] text-lg w-full tracking-wide">
                <div id="current-weight-group" class="flex flex-col mb-5 w-full">
                    <label class="mb-3 mt-6 text-xl font-normal" for="current-weight">Add your current weight</label>
                    <NumberInput
                        v-model="currentWeight"
                        id="current-weight"
                        name="current-weight"
                        placeholder="enter current weight"
                        :min="0.1"
                        :max="1000"
                    />
                </div>
                <input class="mt-auto mb-5 bg-[#2058E8] py-4 w-[87%] rounded-xl text-white font-semibold cursor-pointer" type="submit" value="Add weight" onsubmit="">
            </form>
        </div>
    </div>
    <div class="flex justify-center items-center p-2 bg-[#6D1D7C] rounded-full cursor-pointer">
        <div :onclick="handleDialog" data-testid="add-weight-btn" class="bg-[url('/src/assets/plus.png')] bg-no-repeat bg-contain h-8 w-8"></div>
    </div>
</template>
