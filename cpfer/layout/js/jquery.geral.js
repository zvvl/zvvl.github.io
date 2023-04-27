$(document).ready(function () {

    GerarCPF = function (a1,a2,a3,a4,a5,a6,a7,a8,a9) {
        var max = 9;

	if (a1.length < 1) {
	        var n1 = Sortear(max);
	    } else {
	        var n1 = a1;
	    }

	if (a2.length < 1) {
	        var n2 = Sortear(max);
	    } else {
	        var n2 = a2;
	    }

	if (a3.length < 1) {
	        var n3 = Sortear(max);
	    } else {
	        var n3 = a3;
	    }

	if (a4.length < 1) {
	        var n4 = Sortear(max);
	    } else {
	        var n4 = a4;
	    }

	if (a5.length < 1) {
	        var n5 = Sortear(max);
	    } else {
	        var n5 = a5;
	    }

	if (a6.length < 1) {
	        var n6 = Sortear(max);
	    } else {
	        var n6 = a6;
	    }

	if (a7.length < 1) {
	        var n7 = Sortear(max);
	    } else {
	        var n7 = a7;
	    }

	if (a8.length < 1) {
	        var n8 = Sortear(max);
	    } else {
	        var n8 = a8;
	    }

	if (a9.length < 1) {
	        var n9 = Sortear(max);
	    } else {
	        var n9 = a9;
	    }

        var d1 = n9 * 2 + n8 * 3 + n7 * 4 + n6 * 5 + n5 * 6 + n4 * 7 + n3 * 8 + n2 * 9 + n1 * 10;
        d1 = 11 - (Mod(d1, 11));
        if (d1 >= 10) { d1 = 0 };
        var d2 = d1 * 2 + n9 * 3 + n8 * 4 + n7 * 5 + n6 * 6 + n5 * 7 + n4 * 8 + n3 * 9 + n2 * 10 + n1 * 11;
        d2 = 11 - (Mod(d2, 11));
        if (d2 >= 10) { d2 = 0 };
        var cpf = '' + n1 + n2 + n3 + '.' + n4 + n5 + n6 + '.' + n7 + n8 + n9 + '-' + d1 + d2;

        return cpf;
    }

    Sortear = function (valor) {
        return Math.round(Math.random() * valor);
    }

    Mod = function (dividendo, divisor) {
        return Math.round(dividendo - (Math.floor(dividendo / divisor) * divisor));
    }

    $('.botao-gerar').click(function () {
        var a1 = $('.digito-cpf-1').val();
        var a2 = $('.digito-cpf-2').val();
        var a3 = $('.digito-cpf-3').val();
        var a4 = $('.digito-cpf-4').val();
        var a5 = $('.digito-cpf-5').val();
        var a6 = $('.digito-cpf-6').val();
        var a7 = $('.digito-cpf-7').val();
        var a8 = $('.digito-cpf-8').val();
        var a9 = $('.digito-cpf-9').val();
        var cpf = GerarCPF(a1,a2,a3,a4,a5,a6,a7,a8,a9);
        $('.campo-cpf').val(cpf);
        return false;
    });

    ValidaCPF = function () {
        var i;

        var cpf = $('.campo-cpf').val();
        cpf = cpf.replace('.', '').replace('.', '').replace('-', '');

        if (cpf.length != 11 || cpf == "00000000000" || cpf == "11111111111" || cpf == "22222222222" || cpf == "33333333333" || cpf == "44444444444" || cpf == "55555555555" || cpf == "66666666666" || cpf == "77777777777" || cpf == "88888888888" || cpf == "99999999999")
            return false;
        add = 0;
        for (i = 0; i < 9; i++)
            add += parseInt(cpf.charAt(i)) * (10 - i);
        rev = 11 - (add % 11);
        if (rev == 10 || rev == 11)
            rev = 0;
        if (rev != parseInt(cpf.charAt(9)))
            return false;
        add = 0;
        for (i = 0; i < 10; i++)
            add += parseInt(cpf.charAt(i)) * (11 - i);
        rev = 11 - (add % 11);
        if (rev == 10 || rev == 11)
            rev = 0;
        if (rev != parseInt(cpf.charAt(10)))
            return false;

        return true;
    }

    $('.botao-validar').click(function () {
        if (ValidaCPF()) {
            $('#resultado').html('CPF validado com sucesso.');
            $('#resultado').css({ color: 'green' });
        }
        else {
            $('#resultado').html('CPF invalido.');
            $('#resultado').css({color:'red'});
        }

    });
});

