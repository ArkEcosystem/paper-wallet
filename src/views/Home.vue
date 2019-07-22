<template>
    <div class="home">
        <h1>ARK Paper Wallet</h1>
        <span>Generate Your Own Unique ARK Passphrase and Address</span>
        <div class="flex flex-row mt-5">
            <router-link class="primary-action-button mr-5" to="/wallet-from-entropy">Create a new wallet</router-link>
            <router-link class="secondary-action-button" to="/wallet-from-passphrase">Enter a secret passphrase</router-link>
        </div>
    </div>
</template>
