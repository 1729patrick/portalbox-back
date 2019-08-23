import * as Yup from 'yup';

import Company from '../schemas/Company';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      creci: Yup.string(),
      phones: Yup.array(
        Yup.object().shape({
          number: Yup.string().required(),
          isWhatsapp: Yup.bool(),
        })
      ),
      emails: Yup.array(Yup.string()),
      address: Yup.object().shape({
        street: Yup.string().required(),
        number: Yup.number(),
        neighborhood: Yup.string().required(),
        city: Yup.string().required(),
        cep: Yup.string().required(),
      }),
      logo: Yup.string(),
      officeHours: Yup.string(),
      username: Yup.string().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const checkCompanyExist = await Company.find({
      username: req.body.username,
    });

    if (checkCompanyExist.length) {
      return res.status(400).json({ error: 'Company alread exists' });
    }

    const {
      name,
      creci,
      phones,
      emails,
      address,
      officialHours,
    } = await Company.create(req.body);

    return res.json({ name, creci, phones, emails, address, officialHours });
  }

  async index(req, res) {
    const company = await Company.findById(req.companyId);

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const { name, creci, phones, emails, address, officialHours } = company;

    return res.json({ name, creci, phones, emails, address, officialHours });
  }
}

export default new SessionController();
