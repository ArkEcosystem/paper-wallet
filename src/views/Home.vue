<template>
    <div class="home">
        <div class="flex flex-col sm:flex-row flex-wrap mt-5">
            <router-link class="primary-action-button mb-5 sm:mb-0 sm:mr-5 whitespace-no-wrap" to="/wallet-from-entropy"
                >Create a new wallet</router-link
            >
            <router-link class="link-button whitespace-no-wrap" to="/wallet-from-passphrase"
                >Enter a secret passphrase</router-link
            >
        </div>
    </div>
</template>
