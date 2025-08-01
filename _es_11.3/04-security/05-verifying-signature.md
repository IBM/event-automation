---
title: "Verifying container image signatures"
excerpt: "Verify your CISO image signatures."
categories: security
slug: verifying-signature
toc: true
---

Digital signatures provide a way for consumers of content to ensure that what they download is both authentic (it originated from the expected source) and has integrity (it is what we expect it to be). All images for the {{site.data.reuse.es_name}} certified container in the IBM Entitled Registry are signed following the approach from Red Hat.

You can use the signature to verify that the images came from IBM when they are pulled onto the system.

## Before you begin

- Ensure that the following command-line tools are installed on your computer. On Linux systems, these images can typically be installed by using the package manager.

  - [The OpenShift Container Platform CLI](https://docs.openshift.com/container-platform/4.15/cli_reference/openshift_cli/getting-started-cli.html){:target="_blank"}
  - [The IBM Catalog Management Plug-in for IBM Cloud Paks (ibm-pak)](https://github.com/IBM/ibm-pak-plugin/releases/latest){:target="_blank"}
  - [GNU Privacy Guard (GnuPG) version 2](https://gnupg.org/){:target="_blank"}
  - [Skopeo](https://github.com/containers/skopeo){:target="_blank"}

- On the computer where the command-line tools are installed, copy the following version-specific text block exactly as shown into a text editor, and save it in a file named `acecc-public.gpg`. The following text block represents the {{site.data.reuse.es_name}}-certified container public key in the GNU Privacy Guard format.

  ```console
    -----BEGIN PGP PUBLIC KEY BLOCK-----

  mQINBGP9DMgBEADCSPlk3GN4qbs+kHFuYnKR3d25Tpv0w1FR04krE4eJZleGzv9V
  ipZ21ywcKxE9Y9KOseKt4/QT+vsJbmDdrhZQNCqJzxGkL27lS/Dfqc6GfSas3qhY
  Zghmd6+S9Wo4G9oIAAE7/wZcchltoEyYd4/VihuU5uKmcRZ8U/k7+lCMQV2qt0+l
  PgCtyQ6dlbqtwm4gjNeHu6rz69Hk4PA9EN1h2J0yHtiTDYL4wV0tjbh7t6s/WYHW
  KkLbDbXybWdTD7CitcZ3mneXI+ij5N0iB63HIrmVQKaP/bWsuWwaijGGZM+LjUf6
  MRBTjfiqLKrmlnaL2xwo200Z+vHV705et81aOefOLxCE2bqnXnhyMup5NE+U4BVx
  57aTVW4sL03OpSF0Lj+Jms2JjoNtG84qLv2w7XKozhc+yunv7wghnuaubqiAc3tO
  3pHuP92r8IVMcHkFsbGZAJxi891nYthIQAQwUNkvfgVC83y3BdPrxlwUu9qD9nhl
  q56n7c571keXlTQ1fT/Km4o2yhG7JfkpJvvChTVTYx8g+ST4dEgxY3A8tmxTo0ss
  pHBp1f3ry1QAyp72yjobar/xZOB1+O2YBmGHhM1cm4pZNdd7DcxJNYqgP+Y/o83l
  UATX/QUInD1Jjz1aPiCplwd7J3rctEE+TZ1gSLwhLFBKrynOte+GVERO0wARAQAB
  tCZRdWlubmlwaWFjIFByb2R1Y3RzIDxwc2lydEB1cy5pYm0uY29tPokCOgQTAQgA
  JAUCY/0MyAIbDwULCQgHAgYVCgkICwIEFgIDAQIeAQUJAAAAAAAKCRDSz7jRu6g0
  HsY8EAC4nvJW5QPxhSY5oaUtA5bx5KLt4LQ8ib316C0lhZV+YilvkOkcXsfvLdon
  Y61xrp/WBTjzmAm6X7EFypJI33Olo+pBtBq7lOOuwOH8Y/n/BM9qSSzL9EQmqO8r
  rZ3Qk7jsSVLT18NhEX76dC72MnXJwK6p0A+4Gc7UiG1sSOZgi5pqrLWaWlABWVp8
  fVwWVRy7rcQMulJOxD6FRrt/HsIZm0hPQrxeXMLn9pKzKm3DVwSUD91xLjjh+/cQ
  gRpIaV1AYvV8+74d29cBAaNMZigfrbSROfxWtgBpIKuBxCvEdSjzJe6G34Usdg0Q
  Owcm+FHsyk/QTAClSueCz/fpUirYQM2SKweeelhYNQr0gII1P8LF0RpmKJ8I68dn
  sZZI8JlIs0stz+kU4FZLPF+vMwl9Fq6/EJ0tNQcleWiDpH8Gz7hwCbpoLBnWyR0j
  NDZ9xZ8KxUtfdchptja93t0hJpcTs97HyRtgKydguWT3wbvH31U2J+hR45/PQgYE
  UV8yeGx9p2WNi2G4FbPw7f/781RZgZ4ZesTBzQrdZwfyz/brBBv2jWfg6bHmTGh3
  QuRoFeqg9GW3p2QGFIIazDZJ+XHAk7NKNH5m3ao9U/x0g/fth4iUKxIGp4c7A54L
  fROemzTVxd8jHEGGUlgZ6Bi0NdSGOF1htWBDo88XnewLiKNpHw==
  =jPze
  -----END PGP PUBLIC KEY BLOCK-----
  ```


## Obtaining the container images

Obtain the list of {{site.data.reuse.es_name}}-certified container images to verify as described in the following sections.

### Prepare your bastion host

Ensure you meet the following prerequisites before downloading the CASE archive and obtaining the images:

- A computer with internet access on which you can run the required commands. This computer must also have access to the cluster, and is referred to as a **bastion host**.
- A cluster that is already set up and running a supported version of the {{site.data.reuse.openshift}}. For more information, see the [support matrix]({{ 'support/matrix/#event-streams' | relative_url }}) for supported versions.
- A private Docker registry that can be accessed by the cluster and the bastion host, and which will be used to store all images on your restricted network.

If the cluster has a bastion host which has access to the public internet, then the following steps can be performed from the bastion host.

**Note:** In the absence of a bastion host, prepare a portable device that has access to the public internet to download the CASE archive and images, and also has access to an image registry where the images will be mirrored.

### Download the CASE archive

Download the Container Application Software for Enterprises (CASE) archive. This archive, which is typically provided for installing within a restricted network, includes metadata and files that you will require later.

Complete the following steps to download the CASE archive:

1. {{site.data.reuse.openshift_cli_login}}
2. Configure the internal repository for downloading the CASE archive:

   ```shell
   oc ibm-pak config repo 'default' -r "https://github.com/IBM/cloud-pak/raw/master/repo/case/" --enable
   ```

3. Run the following command to download, validate, and extract the CASE archive.

   ```shell
   oc ibm-pak get ibm-eventstreams
   ```

   Where `<path-to-case-archive>` is the location of the CASE archive. If you are running the command from the current location, set the path to the current directory (`.`).
    The following output is displayed:

   ```shell
   Downloading and extracting the CASE ...
   - Success
   Retrieving CASE version ...
   - Success
   Validating the CASE ...
   Validating the signature for the ibm-eventstreams CASE...
   - Success
   Creating inventory ...
   - Success
   Finding inventory items
   - Success
   Resolving inventory items ...
   Parsing inventory items
   - Success
   Download of CASE: ibm-eventstreams, version: 3.3.2 is complete
   ```

4. Verify that the CASE archive and images `.csv` files have been generated for the {{site.data.reuse.es_name}}. For example, ensure you have the following files generated for the {{site.data.reuse.es_name}} CASE.

   ```shell
   $ tree ~/.ibm-pak

   ├── config
   │   └── config.yaml
   ├── data
   │   ├── cases
   │   │   └── ibm-eventstreams
   │   │       └── 3.3.2
   │   │           ├── caseDependencyMapping.csv
   │   │           ├── charts
   │   │           ├── ibm-eventstreams-3.3.2-airgap-metadata.yaml
   │   │           ├── ibm-eventstreams-3.3.2-charts.csv
   │   │           ├── ibm-eventstreams-3.3.2-images.csv
   │   │           ├── ibm-eventstreams-3.3.2.tgz
   │   │           └── resourceIndexes
   │   │               └── ibm-eventstreams-resourcesIndex.yaml
   │   └── mirror
   └── logs
       └── oc-ibm_pak.log

   9 directories, 8 files
   ```

### Obtain the files

1. After meeting the required prerequisites and downloading the CASE archive, obtain the following files:

   - The downloaded CASE archives, which contain metadata for the container images required to deploy each {{site.data.reuse.es_name}} capability. Each CASE archive also contains the required scripts to mirror images to a private registry, and to configure the target cluster to use the private registry as a mirror.
   - Generated comma-separated value (CSV) files listing the images. Obtain an IBM Entitled Registry entitlement key from the [IBM Container software library](https://myibm.ibm.com/products-services/containerlibrary){:target="_blank"}. The CSV files, combined with your entitlement key, are used for downloading or mirroring the images manually.

   To verify the image signatures for a {{site.data.reuse.es_name}}-certified container, use the file that is named in the format `ibm-eventstreams-<v.r.m>-images.csv`, where `v.r.m` represents the {{site.data.reuse.es_name}} CASE version.

2. Use a shell script to parse through the CSV file and print out the list of "manifest list images" with their digests or tags. You can use the listed names when pulling and verifying image signatures. In the `tail` command, `/tmp/cases` represents the directory where you downloaded the CASE archive.

   - List images by digest:

     ```shell
     tail -q -n +2 /tmp/cases/ibm-eventstreams-*-images.csv | while IFS="," read registry image_name tag digest mtype os arch variant insecure digest_source image_type groups; do
     if [[ "$mtype" == "LIST" ]]; then
         echo "$registry/$image_name@$digest"
     fi
     done
     ```

   - List images by tag:

     ```shell
     tail -q -n +2 /tmp/cases/ibm-eventstreams-*-images.csv | while IFS="," read registry image_name tag digest mtype os arch variant insecure digest_source image_type groups; do
     if [[ "$mtype" == "LIST" ]]; then
         echo "$registry/$image_name:$tag"
     fi
     done
     ```

  **Note:** You can also copy the output to a file for ease of reference while verifying the image signatures.

## Verifying the signature

To verify the image signatures, complete the following steps:

1. Import the {{site.data.reuse.es_name}}-certified container public key on the computer where you saved the public key to a file as described in the [Before you begin](#before-you-begin) section.


   ```shell
   sudo gpg --import acecc-public.gpg
   ```


   **Note:** This step needs to be done only once on each computer that you use for signature verification.

2. Calculate the fingerprint.


   ```shell
   fingerprint=$(sudo gpg --fingerprint --with-colons | grep fpr | tr -d 'fpr:')
   ```


   This command stores the key's fingerprint in an environment variable called `fingerprint`, which is needed for the command to verify the signature.

   **Note:** When you exit your shell session, the variable will be deleted. The next time you log in to your computer, you can set the environment variable again by rerunning the command in this step.

3. Log in to `skopeo` to access the entitled registry. Use `cp` as the username and your entitlement key as the password.
For example:

   ```shell
   skopeo login cp.icr.io --username cp --password myEntitlementKey
   ```

4. Create a directory (for example, `images`) for the image. Then use `skopeo` to pull the image into local storage, where `imageName` represents the image name.

   ```shell
   mkdir images
   skopeo copy docker://<imageName> dir:./images
   ```

   For example:

   ```shell
   mkdir images
   skopeo copy docker://icr.io/cpopen/ibm-eventstreams-catalog:3.0.0-00000000-000000 dir:./images
   ```

   This command downloads the `image` as a set of files and places them in the `images` directory, or in a directory that you specified. A manifest file named `images/manifest.json`, and a set of signature files named `images/signature-1`, `images/signature-2`, and `images/signature-3` are added to the directory. You will use these files to verify the signature in the next step.

5. Verify the signature for each required image, where `imageName` is the name of the image and `signature-N` relates to a format for the name.

   ```shell
   sudo skopeo standalone-verify ./images/manifest.json <imageName> ${fingerprint} ./images/<signature-N>
   ```

   For example:

   ```shell
   sudo skopeo standalone-verify ./images/manifest.json icr.io/cpopen/ibm-eventstreams-catalog:3.0.0-00000000-000000 ${fingerprint} ./images/signature-1
   ```

   You will receive a confirmation similar to the following:

   ```shell
   Signature verified, digest sha256:0000000000000000000000000000000000000000000000000000000000000000
   ```
