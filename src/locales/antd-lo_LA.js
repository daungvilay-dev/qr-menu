import enUS from 'ant-design-vue/es/locale/en_US'

const loLA = {
  ...enUS,
  locale: 'lo',
  global: {
    placeholder: 'ກະລຸນາເລືອກ',
  },
  Table: {
    ...enUS.Table,
    filterTitle: 'ຕົວກອງ',
    filterConfirm: 'ຕົກລົງ',
    filterReset: 'ລ້າງຄ່າ',
    filterEmptyText: 'ບໍ່ມີຕົວກອງ',
    filterCheckall: 'ເລືອກທັງໝົດ',
    filterSearchPlaceholder: 'ຄົ້ນຫາໃນຕົວກອງ',
    emptyText: 'ບໍ່ມີຂໍ້ມູນ',
    selectAll: 'ເລືອກໜ້ານີ້',
    selectInvert: 'ກັບດ້ານການເລືອກ',
    selectNone: 'ລ້າງຂໍ້ມູນທັງໝົດ',
    selectionAll: 'ເລືອກຂໍ້ມູນທັງໝົດ',
    sortTitle: 'ຈັດລຽງ',
    expand: 'ຂະຫຍາຍແຖວ',
    collapse: 'ຫຍໍ້ແຖວ',
    triggerDesc: 'ຄລິກເພື່ອຈັດລຽງຈາກຫຼາຍໄປນ້ອຍ',
    triggerAsc: 'ຄລິກເພື່ອຈັດລຽງຈາກນ້ອຍໄປຫຼາຍ',
    cancelSort: 'ຄລິກເພື່ອຍົກເລີກການຈັດລຽງ',
  },
  Modal: {
    okText: 'ຕົກລົງ',
    cancelText: 'ຍົກເລີກ',
    justOkText: 'ຮັບຊາບ',
  },
  Popconfirm: {
    okText: 'ຕົກລົງ',
    cancelText: 'ຍົກເລີກ',
  },
  Transfer: {
    ...enUS.Transfer,
    searchPlaceholder: 'ຄົ້ນຫາບ່ອນນີ້',
    itemUnit: 'ລາຍການ',
    itemsUnit: 'ລາຍການ',
    remove: 'ລຶບອອກ',
    selectCurrent: 'ເລືອກໜ້າປັດຈຸບັນ',
    removeCurrent: 'ລຶບໜ້າປັດຈຸບັນ',
    selectAll: 'ເລືອກທັງໝົດ',
    removeAll: 'ລຶບທັງໝົດ',
    selectInvert: 'ກັບດ້ານການເລືອກ',
  },
  Upload: {
    uploading: 'ກຳລັງອັບໂຫຼດ...',
    removeFile: 'ລຶບໄຟລ໌',
    uploadError: 'ອັບໂຫຼດຜິດພາດ',
    previewFile: 'ເບິ່ງໄຟລ໌',
    downloadFile: 'ດາວໂຫຼດໄຟລ໌',
  },
  Empty: {
    description: 'ບໍ່ມີຂໍ້ມູນ',
  },
  Text: {
    edit: 'ແກ້ໄຂ',
    copy: 'ຄັດລອກ',
    copied: 'ຄັດລອກແລ້ວ',
    expand: 'ຂະຫຍາຍ',
  },
  PageHeader: {
    back: 'ກັບຄືນ',
  },
  Form: {
    optional: '(ບໍ່ບັງຄັບ)',
    defaultValidateMessages: {
      default: 'ກວດສອບ ${label} ບໍ່ສຳເລັດ',
      required: 'ກະລຸນາປ້ອນ ${label}',
      enum: '${label} ຕ້ອງເປັນໜຶ່ງໃນ [${enum}]',
      whitespace: '${label} ຕ້ອງບໍ່ເປັນຄ່າຫວ່າງ',
      date: {
        format: 'ຮູບແບບວັນທີຂອງ ${label} ບໍ່ຖືກຕ້ອງ',
        parse: '${label} ບໍ່ສາມາດແປງເປັນວັນທີໄດ້',
        invalid: '${label} ບໍ່ແມ່ນວັນທີທີ່ຖືກຕ້ອງ',
      },
      string: {
        len: '${label} ຕ້ອງມີ ${len} ຕົວອັກສອນ',
        min: '${label} ຕ້ອງມີຢ່າງໜ້ອຍ ${min} ຕົວອັກສອນ',
        max: '${label} ຕ້ອງບໍ່ເກີນ ${max} ຕົວອັກສອນ',
        range: '${label} ຕ້ອງຢູ່ລະຫວ່າງ ${min}-${max} ຕົວອັກສອນ',
      },
      number: {
        len: '${label} ຕ້ອງເທົ່າກັບ ${len}',
        min: '${label} ຕ້ອງບໍ່ນ້ອຍກວ່າ ${min}',
        max: '${label} ຕ້ອງບໍ່ເກີນ ${max}',
        range: '${label} ຕ້ອງຢູ່ລະຫວ່າງ ${min}-${max}',
      },
      array: {
        len: 'ຕ້ອງມີ ${len} ${label}',
        min: 'ຢ່າງໜ້ອຍ ${min} ${label}',
        max: 'ສູງສຸດ ${max} ${label}',
        range: 'ຈຳນວນ ${label} ຕ້ອງຢູ່ລະຫວ່າງ ${min}-${max}',
      },
      pattern: {
        mismatch: '${label} ບໍ່ກົງກັບຮູບແບບ ${pattern}',
      },
    },
  },
  Image: {
    preview: 'ເບິ່ງຕົວຢ່າງ',
  },
  QRCode: {
    expired: 'QR code ໝົດອາຍຸ',
    refresh: 'ໂຫຼດຄືນ',
    scanned: 'ສະແກນແລ້ວ',
  },
}

export default loLA
