---
title: "Encrypting your data"
excerpt: "Find out how data is encrypted in Event Endpoint Management and how to rotate the encryption key."
categories: security
slug: data-encryption
toc: true
---

The data that is stored in your {{site.data.reuse.eem_name}} instance is encrypted. The data is encrypted with a data encryption key, and the data encryption key itself is encrypted with a master key.

When an {{site.data.reuse.eem_name}} instance is created, a secret called `<instance-name>-ibm-eem-mek` is created. This secret contains the master key for decrypting the stored data.

**Important:** If you enabled persistence for your {{site.data.reuse.eem_name}} instance and set the `deleteClaim` storage property to `false`, a backup of the `<instance-name>-ibm-eem-mek` secret is created. This backup secret is not automatically deleted when you uninstall an {{site.data.reuse.eem_name}} instance. Therefore, the backup of the master key is still available to decrypt persisted data.

The master key is responsible for encrypting the data encryption key, which encrypts the {{site.data.reuse.eem_name}} data. While the master key is stored in the secret `<instance-name>-ibm-eem-mek`, the data encryption key is stored in the disk space and is not exposed.

The separation of the master key and the data encryption key means there is usually no reason to rotate the data encryption key. The rotation of the master key, which is used to protect the data encryption key, can be done efficiently without the need to decrypt and re-encrypt the data itself.

## Rotating the encryption key

Instead of the master key provided by {{site.data.reuse.eem_name}}, you can encrypt the data encryption key with a custom key you create. The value of the custom key must be a Base64-encoded string, and use the Advanced Encryption Standard (AES) algorithm.

To create a custom key and use it instead of the master key:

1. Create a new encryption key by running the following `openssl` command:

   ```bash
   $ openssl enc -aes128 -k secret -P -md sha1 -pbkdf2 -iter 65535
   ```

   An output similar to the following is displayed:

   ```bash
   salt=194B6AEFEDBF7FCE
   key=<key>
   iv =0AC601AB78B3623D1F3C0B190BFF0058
   ```

   Where `<key>` is the new encryption key.

   **Important:** This command is based on `openssl`.  You can use any method to produce an AES key. If the `key` and `iv` are generated with another tool, you must verify that the output is hex-encoded and that the size of the key for the 128-bit key is 32 characters.


2. Create a secret with the encryption key that you generated in the previous step:

   ```yaml
   $ cat <<EOF | kubectl apply -f -
   kind: Secret
   apiVersion: v1
   metadata:
     name: <name>
   data:
     encryption-main-key: <key>
   type: Opaque
   EOF
   ```

   Where:

   - `<name>` is the name of the secret.
   - `<key>` is the encryption key that you generated earlier.

3. After the secret is created, edit the `EventEndpointManagement` custom resource to set `spec.manager.storage.rotationSecretName` to the name of the secret.

   The {{site.data.reuse.eem_name}} operator starts the rotation of the encryption key. The rotation to use the custom key is complete when the `EventEndpointManagement` custom resource reports status as `Ready`.


4. Validate that the rotation was successful by checking whether the values of `<instance-name>-ibm-eem-mek` are the same as the rotation secret that you created earlier.

5. You can remove the `spec.manager.storage.rotationSecretName` field from the `EventEndpointManagement` custom resource and delete the rotation secret.

   **Note:** Remove the `spec.manager.storage.rotationSecretName` field after completing the previous steps to avoid errors that might occur within the operator when the operator tries to find a secret that does not exist.

Your data encryption key is encrypted with the new custom master key that you created.
