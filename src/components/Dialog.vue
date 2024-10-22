<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
    import { doc, serverTimestamp, setDoc, collection, DocumentReference, CollectionReference, addDoc} from "firebase/firestore";
    import { db } from '../firebase'
    import { getAuth } from 'firebase/auth'
    const user = getAuth().currentUser

    const props = defineProps({
        message: String,
        handleDialog: Function
    })
    import { ref, reactive } from 'vue';
    const currentWeight = ref(null)
    const state = reactive({ currentWeight })
    const closeDialog = () => {
        document.getElementById('dialog-container')?.classList.replace('block', 'hidden')
        props.handleDialog && props.handleDialog()
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

    const filterInput = (event: KeyboardEvent) => {
      const input = event.target as HTMLInputElement;
      const currentValue = input.value;
      const key = event.key;

      // Allow Tab key for navigation
      if (key === 'Tab') {
        return;
      }

      // Allow backspace and arrow keys
      if (key === 'Backspace' || key === 'ArrowLeft' || key === 'ArrowRight') {
        return;
      }

      // Allow numbers
      if (/^[0-9]$/.test(key)) {
        const newValue = currentValue + key;
        if (parseFloat(newValue) > 1000) {
          event.preventDefault();
        }
        return;
      }

      // Allow decimal point only if it doesn't exist and there's a number before it
      if (key === '.' && !currentValue.includes('.') && currentValue.length > 0) {
        return;
      }

      // Prevent default for any other key
      event.preventDefault();
    }

    const formatInput = (event: Event) => {
      const input = event.target as HTMLInputElement;
      let value = input.value;
      const parts = value.split('.');
      if (parts.length > 1) {
        // Keep only one decimal place
        parts[1] = parts[1].slice(0, 1);
        value = parts.join('.');
      }
      const numValue = parseFloat(value);
      if (numValue > 1000) {
        value = '1000';
      }
      input.value = value;
    }

    const handleBlur = (event: Event) => {
      const input = event.target as HTMLInputElement;
      let value = input.value;
      if (value.endsWith('.')) {
        value += '0';
      }
      input.value = value;
    }
</script>


<template>
    <div id='dialog-container' class="hidden absolute top-0 left-0 h-full w-full z-[100] bg-gray-500 opacity-75 flex justify-center items-center min-w-[300px]">
        <div data-testid='dialog-content' class="relative flex flex-col justify-center items-center h-54 w-80 bg-white my-[50%] pl-5 rounded-xl">
            <p data-testid='close-dialog' :onclick="closeDialog" class="inline-flex absolute top-[1rem] right-[1rem] text-2xl cursor-pointer">✕</p>
            <form @submit.prevent="handleSubmit" class="flex flex-col justify-center items-start text-[#4B4B4B] text-lg w-full tracking-wide">
                <div id="current-weight-group" class="flex flex-col mb-5 w-full">
                    <label class="mb-3 mt-6 text-xl font-normal" for="current-weight">{{ props.message }}</label>
                    <input
                        v-model="currentWeight"
                        @keydown="filterInput"
                        @input="formatInput"
                        @blur="handleBlur"
                        class="no-spinner placeholder:text-[#BDBDBD] h-14 pl-3 mr-10 rounded-lg bg-white border border-[#BDBDBD]"
                        type="text"
                        id="current-weight"
                        name="current-weight"
                        min="0.1"
                        step="0.1"
                        pattern="^\d+(\.\d{0,1})?$"
                        placeholder="enter current weight"
                        required
                        tabindex="0"
                    >
                </div>
                <input class="mt-auto mb-5 bg-[#2058E8] py-4 w-[87%] rounded-xl text-white font-semibold cursor-pointer" type="submit" value="Add weight" onsubmit="">
            </form>
        </div>
    </div>
</template>
